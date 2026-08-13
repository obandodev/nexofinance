from sqlalchemy import func
from sqlalchemy.orm import Session

from app.modules.budgets.models.budget import Budget
from app.modules.categories.models.category import Category
from app.modules.transactions.models.transaction import Transaction
from app.modules.accounts.models.account import Account
from app.modules.budgets.schemas.budget import BudgetProgress


def get_budget_progress(db: Session, user_id: int, month: str) -> list[BudgetProgress]:
    """Para cada presupuesto del mes, calcula cuanto se ha gastado realmente en esa categoria.
    Las transacciones anuladas NO cuentan como gasto real."""
    budgets = db.query(Budget).filter(Budget.user_id == user_id, Budget.month == month).all()

    results = []
    for budget in budgets:
        spent = (
            db.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                Transaction.user_id == user_id,
                Transaction.category_id == budget.category_id,
                Transaction.transaction_type == "expense",
                Transaction.is_voided == 0,
                func.to_char(Transaction.transaction_date, "YYYY-MM") == month,
            )
            .scalar()
        )
        category = db.query(Category).filter(Category.id == budget.category_id).first()

        results.append(
            BudgetProgress(
                id=budget.id,
                category_id=budget.category_id,
                category_name=category.name if category else "—",
                month=month,
                limit_amount=budget.limit_amount,
                spent_amount=float(spent),
                remaining_amount=budget.limit_amount - float(spent),
            )
        )
    return results


def get_available_months(db: Session, user_id: int) -> list[str]:
    """Devuelve todos los meses (YYYY-MM) que tienen al menos un presupuesto definido, mas recientes primero."""
    results = (
        db.query(Budget.month)
        .filter(Budget.user_id == user_id)
        .distinct()
        .order_by(Budget.month.desc())
        .all()
    )
    return [r[0] for r in results]



def get_total_available_balance(db: Session, user_id: int) -> float:
    """Suma el saldo de todas las cuentas activas del usuario."""
    total = (
        db.query(func.coalesce(func.sum(Account.balance), 0))
        .filter(Account.user_id == user_id, Account.status == "ACTIVE")
        .scalar()
    )
    return float(total)


def get_total_budgeted(db: Session, user_id: int, month: str, exclude_budget_id: int = None) -> float:
    """Suma el limite de todos los presupuestos ya creados para ese mes (opcionalmente excluyendo uno, util al editar)."""
    query = db.query(func.coalesce(func.sum(Budget.limit_amount), 0)).filter(
        Budget.user_id == user_id, Budget.month == month
    )
    if exclude_budget_id:
        query = query.filter(Budget.id != exclude_budget_id)
    return float(query.scalar())