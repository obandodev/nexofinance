from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User

from app.modules.debts.schemas.debt_payment import (
    DebtPaymentOut,
)

from app.modules.debts.repositories.repository import (
    get_for_user,
    list_payments,
)


router = APIRouter()


@router.get(
    "/{debt_id}/payments",
    response_model=list[DebtPaymentOut],
)
def endpoint(
    debt_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    debt = get_for_user(
        db,
        debt_id,
        user.id,
    )

    if not debt:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Deuda no encontrada.",
        )

    return list_payments(
        db,
        debt_id,
    )