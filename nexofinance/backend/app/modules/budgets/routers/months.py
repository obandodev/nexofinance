from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.budgets.services.budget_service import get_available_months
router=APIRouter()
@router.get("/months", response_model=list[str])
def endpoint(db:Session=Depends(get_db),user:User=Depends(get_current_user)): return get_available_months(db,user.id)
