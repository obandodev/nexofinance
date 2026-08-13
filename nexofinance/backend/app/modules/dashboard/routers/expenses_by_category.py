from datetime import date
from typing import Optional
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.dashboard.schemas.dashboard import ExpenseByCategory
from app.modules.dashboard.services.dashboard_service import get_expenses_by_category
router=APIRouter()
@router.get("/expenses-by-category",response_model=list[ExpenseByCategory])
def endpoint(month:Optional[str]=None,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    return get_expenses_by_category(db,user.id,month or date.today().strftime("%Y-%m"))
