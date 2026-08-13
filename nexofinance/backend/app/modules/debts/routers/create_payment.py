from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User

from app.modules.debts.schemas.debt_payment import (
    DebtPaymentCreate,
    DebtPaymentOut,
)

from app.modules.debts.services.debt_payment_service import (
    create_debt_payment,
)


router = APIRouter()


@router.post(
    "/{debt_id}/payments",
    response_model=DebtPaymentOut,
)
def endpoint(
    debt_id: int,
    data: DebtPaymentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return create_debt_payment(
        db,
        debt_id,
        data,
        user.id,
    )