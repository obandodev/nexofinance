from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.savings.schemas.savings_goal import SavingsGoalCreate,SavingsGoalOut
from app.modules.savings.services.savings_service import create_goal
router=APIRouter()
@router.post("/",response_model=SavingsGoalOut)
def endpoint(data:SavingsGoalCreate,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return create_goal(db,data,user.id)
