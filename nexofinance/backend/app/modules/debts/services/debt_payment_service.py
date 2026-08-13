from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.modules.accounts.models.account import Account
from app.modules.debts.models.debt_payment import DebtPayment
from app.modules.debts.repositories.repository import (
    get_for_user,
    create_payment,
)
from app.modules.debts.services.debt_service import (
    _calculate_paid_amount,
)
from app.modules.debts.validators.debt_payment_validator import (
    validate_payment_amount,
)


def create_debt_payment(
    db: Session,
    debt_id: int,
    data,
    user_id: int,
):
    debt = get_for_user(
        db,
        debt_id,
        user_id,
    )

    if not debt:
        raise HTTPException(
            status_code=404,
            detail="Deuda no encontrada.",
        )

    if debt.status == "CANCELLED":
        raise HTTPException(
            status_code=400,
            detail="No puedes registrar pagos en una deuda cancelada.",
        )

    if debt.status == "PAID":
        raise HTTPException(
            status_code=400,
            detail="Esta deuda ya está completamente pagada.",
        )

    validate_payment_amount(
        data.amount
    )

    paid_amount = _calculate_paid_amount(
        db,
        debt.id,
    )

    pending_amount = (
        debt.total_amount - paid_amount
    )

    if data.amount > pending_amount:
        raise HTTPException(
            status_code=400,
            detail=(
                "El pago no puede ser mayor "
                "al monto pendiente."
            ),
        )

    account = (
        db.query(Account)
        .filter(
            Account.id == data.account_id,
            Account.user_id == user_id,
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Cuenta no encontrada.",
        )

    if account.status != "ACTIVE":
        raise HTTPException(
            status_code=400,
            detail="La cuenta se encuentra desactivada.",
        )

    # Si el usuario debe dinero,
    # el pago sale de su cuenta.
    if debt.debt_type == "debt":

        if account.balance < data.amount:
            raise HTTPException(
                status_code=400,
                detail="Saldo insuficiente en la cuenta.",
            )

        account.balance -= data.amount

    # Si al usuario le deben dinero,
    # el dinero entra a su cuenta.
    elif debt.debt_type == "loan":

        account.balance += data.amount

    else:
        raise HTTPException(
            status_code=400,
            detail="Tipo de deuda inválido.",
        )

    payment = DebtPayment(
        debt_id=debt.id,
        account_id=data.account_id,
        amount=data.amount,
        payment_date=data.payment_date,
        note=data.note,
    )

    create_payment(
        db,
        payment,
    )

    new_paid_amount = (
        paid_amount + data.amount
    )

    if new_paid_amount >= debt.total_amount:
        debt.status = "PAID"

    else:
        debt.status = "PARTIAL"

    db.commit()
    db.refresh(payment)

    return payment