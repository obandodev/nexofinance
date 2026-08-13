from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.modules.debts.models.debt import Debt
from app.modules.debts.models.debt_payment import DebtPayment

from app.modules.debts.repositories.repository import (
    list_for_user,
    get_for_user,
    create,
)

from app.modules.debts.validators.debt_validator import (
    validate_debt_type,
    validate_total_amount,
)


def _calculate_paid_amount(
    db: Session,
    debt_id: int,
):
    result = (
        db.query(
            func.coalesce(
                func.sum(DebtPayment.amount),
                0,
            )
        )
        .filter(
            DebtPayment.debt_id == debt_id,
        )
        .scalar()
    )

    return float(result or 0)


def _update_status(
    db: Session,
    debt: Debt,
):
    paid_amount = _calculate_paid_amount(
        db,
        debt.id,
    )

    if debt.status == "CANCELLED":
        return

    if paid_amount <= 0:
        debt.status = "PENDING"

    elif paid_amount < debt.total_amount:
        debt.status = "PARTIAL"

    else:
        debt.status = "PAID"


def list_debts(
    db: Session,
    user_id: int,
):
    debts = list_for_user(
        db,
        user_id,
    )

    result = []

    for debt in debts:
        paid_amount = _calculate_paid_amount(
            db,
            debt.id,
        )

        pending_amount = max(
            debt.total_amount - paid_amount,
            0,
        )

        result.append(
            {
                "id": debt.id,
                "name": debt.name,
                "debt_type": debt.debt_type,
                "total_amount": debt.total_amount,
                "paid_amount": paid_amount,
                "pending_amount": pending_amount,
                "status": debt.status,
                "due_date": debt.due_date,
            }
        )

    return result


def create_debt(
    db: Session,
    data,
    user_id: int,
):
    validate_debt_type(
        data.debt_type
    )

    validate_total_amount(
        data.total_amount
    )

    debt = Debt(
        user_id=user_id,
        name=data.name,
        debt_type=data.debt_type,
        total_amount=data.total_amount,
        due_date=data.due_date,
        status="PENDING",
    )

    create(
        db,
        debt,
    )

    db.commit()
    db.refresh(debt)

    return debt


def update_debt(
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

    changes = data.model_dump(
        exclude_unset=True
    )

    if "total_amount" in changes:
        validate_total_amount(
            changes["total_amount"]
        )

        paid_amount = _calculate_paid_amount(
            db,
            debt.id,
        )

        if changes["total_amount"] < paid_amount:
            raise HTTPException(
                status_code=400,
                detail=(
                    "El monto total no puede ser menor "
                    "al monto ya pagado."
                ),
            )

    for field, value in changes.items():
        setattr(
            debt,
            field,
            value,
        )

    _update_status(
        db,
        debt,
    )

    db.commit()
    db.refresh(debt)

    return debt