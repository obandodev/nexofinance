from datetime import date
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.modules.accounts.models.account import Account
from app.modules.transactions.models.transaction import Transaction
from app.modules.categories.models.category import Category
from app.modules.debts.models.debt import Debt
from app.modules.debts.models.debt_payment import DebtPayment
from app.modules.savings.models.savings_contribution import SavingsContribution


def active_balance(db: Session, user_id: int):
    return db.query(func.coalesce(func.sum(Account.balance), 0)).filter(
        Account.user_id == user_id, Account.status == "ACTIVE"
    ).scalar()


def monthly_totals(db: Session, user_id: int, month: str):
    income = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == user_id, Transaction.transaction_type == "income",
        Transaction.is_voided == 0, func.to_char(Transaction.transaction_date, "YYYY-MM") == month
    ).scalar()
    expense = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == user_id, Transaction.transaction_type == "expense",
        Transaction.is_voided == 0, func.to_char(Transaction.transaction_date, "YYYY-MM") == month
    ).scalar()
    return float(income), float(expense)


def expenses_by_category(db: Session, user_id: int, month: str):
    return db.query(Category.name, func.sum(Transaction.amount)).join(
        Transaction, Transaction.category_id == Category.id
    ).filter(
        Transaction.user_id == user_id, Transaction.transaction_type == "expense",
        Transaction.is_voided == 0, func.to_char(Transaction.transaction_date, "YYYY-MM") == month
    ).group_by(Category.name).all()


def last_n_months(n: int, end_month: str = None) -> list[str]:
    """Genera los ultimos n meses en formato YYYY-MM, del mas antiguo al mas reciente,
    terminando en end_month (si no se da, termina en el mes actual real)."""
    if end_month:
        year, month = map(int, end_month.split("-"))
    else:
        today = date.today()
        year, month = today.year, today.month

    months = []
    for _ in range(n):
        months.append(f"{year:04d}-{month:02d}")
        month -= 1
        if month == 0:
            month = 12
            year -= 1

    return list(reversed(months))


def pending_debt_totals(db: Session, user_id: int):
    """Suma lo pendiente de deudas (debt_type='debt') y de prestamos hechos (debt_type='loan'),
    ignorando las que estan CANCELLED."""
    debts = (
        db.query(Debt)
        .filter(Debt.user_id == user_id, Debt.status != "CANCELLED")
        .all()
    )

    total_debt = 0.0
    total_loan = 0.0

    for debt in debts:
        paid = (
            db.query(func.coalesce(func.sum(DebtPayment.amount), 0))
            .filter(DebtPayment.debt_id == debt.id)
            .scalar()
        )
        pending = max(debt.total_amount - float(paid or 0), 0)

        if debt.debt_type == "debt":
            total_debt += pending
        elif debt.debt_type == "loan":
            total_loan += pending

    return total_debt, total_loan


def total_saved_month(db: Session, user_id: int, month: str) -> float:
    result = (
        db.query(func.coalesce(func.sum(SavingsContribution.amount), 0))
        .filter(
            SavingsContribution.user_id == user_id,
            SavingsContribution.status == "ACTIVE",
            func.to_char(SavingsContribution.contribution_date, "YYYY-MM") == month,
        )
        .scalar()
    )
    return float(result)


def total_debt_paid_month(db: Session, user_id: int, month: str) -> float:
    result = (
        db.query(func.coalesce(func.sum(DebtPayment.amount), 0))
        .join(Debt, Debt.id == DebtPayment.debt_id)
        .filter(
            Debt.user_id == user_id,
            Debt.debt_type == "debt",
            func.to_char(DebtPayment.payment_date, "YYYY-MM") == month,
        )
        .scalar()
    )
    return float(result)