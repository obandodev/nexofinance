from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.savings.schemas.savings_goal import SavingsGoalOut
from app.modules.savings.services.savings_service import cancel_goal
router=APIRouter()
@router.post("/{goal_id}/cancel",response_model=SavingsGoalOut)
def endpoint(goal_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return cancel_goal(db,goal_id,user.id)
