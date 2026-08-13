from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User

from app.modules.debts.schemas.debt import (
    DebtUpdate,
    DebtOut,
)

from app.modules.debts.services.debt_service import (
    update_debt,
)


router = APIRouter()


@router.patch(
    "/{debt_id}",
    response_model=DebtOut,
)
def endpoint(
    debt_id: int,
    data: DebtUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return update_debt(
        db,
        debt_id,
        data,
        user.id,
    )