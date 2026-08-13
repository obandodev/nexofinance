from sqlalchemy.orm import Session

from app.modules.debts.models.debt import Debt
from app.modules.debts.models.debt_payment import DebtPayment
from app.modules.accounts.models.account import Account


def list_for_user(
    db: Session,
    user_id: int,
):
    return (
        db.query(Debt)
        .filter(Debt.user_id == user_id)
        .order_by(Debt.id.desc())
        .all()
    )


def get_for_user(
    db: Session,
    debt_id: int,
    user_id: int,
):
    return (
        db.query(Debt)
        .filter(
            Debt.id == debt_id,
            Debt.user_id == user_id,
        )
        .first()
    )


def create(
    db: Session,
    debt: Debt,
):
    db.add(debt)
    db.flush()
    return debt


def list_payments(
    db: Session,
    debt_id: int,
):
    rows = (
        db.query(
            DebtPayment,
            Account.name.label("account_name"),
        )
        .join(
            Account,
            Account.id == DebtPayment.account_id,
        )
        .filter(
            DebtPayment.debt_id == debt_id,
        )
        .order_by(
            DebtPayment.payment_date.desc(),
            DebtPayment.id.desc(),
        )
        .all()
    )

    return [
        {
            "id": payment.id,
            "debt_id": payment.debt_id,
            "account_id": payment.account_id,
            "account_name": account_name,
            "amount": payment.amount,
            "payment_date": payment.payment_date,
            "note": payment.note,
        }
        for payment, account_name in rows
    ]


def get_payment(
    db: Session,
    payment_id: int,
    debt_id: int,
):
    return (
        db.query(DebtPayment)
        .filter(
            DebtPayment.id == payment_id,
            DebtPayment.debt_id == debt_id,
            DebtPayment.status == "ACTIVE",
        )
        .first()
    )


def create_payment(
    db: Session,
    payment: DebtPayment,
):
    db.add(payment)
    db.flush()
    return payment