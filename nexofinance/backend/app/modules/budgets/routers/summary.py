from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.budgets.services.budget_service import get_total_available_balance,get_total_budgeted
router=APIRouter()
@router.get("/summary/{month}")
def endpoint(month:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    available=get_total_available_balance(db,user.id); budgeted=get_total_budgeted(db,user.id,month)
    return {"available_balance":available,"total_budgeted":budgeted,"unallocated":available-budgeted}
