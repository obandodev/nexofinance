from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User

from app.modules.debts.schemas.debt import DebtOut

from app.modules.debts.services.debt_service import (
    cancel_debt,
)

router = APIRouter()


@router.post(
    "/{debt_id}/cancel",
    response_model=DebtOut,
)
def endpoint(
    debt_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return cancel_debt(
        db,
        debt_id,
        user.id,
    )