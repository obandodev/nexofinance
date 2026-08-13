from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.savings.schemas.savings_goal import SavingsContributionOut
from app.modules.savings.services.savings_service import cancel_contribution
router=APIRouter()
@router.post("/contributions/{contribution_id}/cancel",response_model=SavingsContributionOut)
def endpoint(contribution_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)): return cancel_contribution(db,contribution_id,user.id)
