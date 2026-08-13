from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.savings.schemas.savings_goal import SavingsContributionOut
from app.modules.savings.services.savings_service import get_goal_contributions
router=APIRouter()
@router.get("/{goal_id}/contributions",response_model=list[SavingsContributionOut])
def endpoint(goal_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return get_goal_contributions(db,goal_id,user.id)
