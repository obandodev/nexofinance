from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.savings.schemas.savings_goal import SavingsGoalOut
from app.modules.savings.services.savings_service import get_goals
router=APIRouter()
@router.get("/",response_model=list[SavingsGoalOut])
def endpoint(db:Session=Depends(get_db),user:User=Depends(get_current_user)): return get_goals(db,user.id)
