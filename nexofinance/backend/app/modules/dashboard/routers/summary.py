from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.dashboard.schemas.dashboard import DashboardSummary
from app.modules.dashboard.services.dashboard_service import get_summary
router=APIRouter()
@router.get("/summary",response_model=DashboardSummary)
def endpoint(db:Session=Depends(get_db),user:User=Depends(get_current_user)): return get_summary(db,user.id)
