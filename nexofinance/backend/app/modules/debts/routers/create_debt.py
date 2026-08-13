from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User

from app.modules.debts.schemas.debt import (
    DebtCreate,
    DebtOut,
)

from app.modules.debts.services.debt_service import (
    create_debt,
)

router = APIRouter()

@router.post("/",response_model=DebtOut,)
def endpoint(
    data: DebtCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return create_debt(
        db,
        data,
        user.id,
    )