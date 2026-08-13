from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User

from app.modules.debts.schemas.debt import (
    DebtOut,
)

from app.modules.debts.services.debt_service import (
    list_debts,
)


router = APIRouter()


@router.get(
    "/",
    response_model=list[DebtOut],
)
def endpoint(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return list_debts(
        db,
        user.id,
    )