from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.savings.schemas.savings_goal import SavingsContributionUpdate,SavingsContributionOut
from app.modules.savings.services.savings_service import update_contribution
router=APIRouter()
@router.patch("/contributions/{contribution_id}",response_model=SavingsContributionOut)
def endpoint(contribution_id:int,data:SavingsContributionUpdate,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return update_contribution(db,contribution_id,data,user.id)
