from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.budgets.schemas.budget import BudgetOut
from app.modules.budgets.repositories.repository import list_for_user
router=APIRouter()
@router.get("/", response_model=list[BudgetOut])
def endpoint(month: Optional[str]=None, db: Session=Depends(get_db), user: User=Depends(get_current_user)):
    return list_for_user(db,user.id,month)
