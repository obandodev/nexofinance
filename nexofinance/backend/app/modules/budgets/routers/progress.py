from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.budgets.schemas.budget import BudgetProgress
from app.modules.budgets.services.budget_service import get_budget_progress
router=APIRouter()
@router.get("/progress/{month}", response_model=list[BudgetProgress])
def endpoint(month:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return get_budget_progress(db,user.id,month)
