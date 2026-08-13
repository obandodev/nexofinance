from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.savings.schemas.savings_goal import SavingsGoalUpdate,SavingsGoalOut
from app.modules.savings.services.savings_service import update_goal
router=APIRouter()
@router.patch("/{goal_id}",response_model=SavingsGoalOut)
def endpoint(goal_id:int,data:SavingsGoalUpdate,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return update_goal(db,goal_id,data,user.id)
