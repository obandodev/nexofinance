from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.budgets.schemas.budget import BudgetUpdate, BudgetOut
from app.modules.budgets.repositories.repository import get_for_user
from app.modules.budgets.services.budget_service import get_total_available_balance, get_total_budgeted
from app.modules.budgets.validators import validate_available
router=APIRouter()
@router.patch("/{budget_id}", response_model=BudgetOut)
def endpoint(budget_id:int,data:BudgetUpdate,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    budget=get_for_user(db,budget_id,user.id)
    if not budget: raise HTTPException(status_code=404,detail="Presupuesto no encontrado")
    if data.limit_amount is not None:
        available=get_total_available_balance(db,user.id); already=get_total_budgeted(db,user.id,budget.month,exclude_budget_id=budget.id)
        validate_available(already,data.limit_amount,available)
    for field,value in data.model_dump(exclude_unset=True).items(): setattr(budget,field,value)
    db.commit(); db.refresh(budget); return budget
