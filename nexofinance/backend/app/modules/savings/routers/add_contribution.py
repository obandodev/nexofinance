from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.savings.schemas.savings_goal import SavingsContributionCreate,SavingsContributionOut
from app.modules.savings.services.savings_service import add_contribution
router=APIRouter()
@router.post("/{goal_id}/contributions",response_model=SavingsContributionOut)
def endpoint(goal_id:int,data:SavingsContributionCreate,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return add_contribution(db,goal_id,data,user.id)
