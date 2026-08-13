from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.budgets.models.budget import Budget
from app.modules.budgets.schemas.budget import BudgetCreate, BudgetOut
from app.modules.budgets.services.budget_service import get_total_available_balance, get_total_budgeted
from app.modules.budgets.validators import validate_available
router=APIRouter()
@router.post("/", response_model=BudgetOut)
def endpoint(data: BudgetCreate, db: Session=Depends(get_db), user: User=Depends(get_current_user)):
    if db.query(Budget).filter(Budget.user_id==user.id, Budget.category_id==data.category_id, Budget.month==data.month).first():
        raise HTTPException(status_code=400, detail="Ya existe un presupuesto para esa categoría en ese mes. Editalo en vez de crear otro.")
    available=get_total_available_balance(db,user.id); already=get_total_budgeted(db,user.id,data.month)
    validate_available(already,data.limit_amount,available)
    budget=Budget(**data.model_dump(),user_id=user.id); db.add(budget); db.commit(); db.refresh(budget); return budget
