from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User

from app.modules.dashboard.schemas.dashboard import FinancialInsights
from app.modules.dashboard.services.dashboard_service import get_insights

router = APIRouter()


@router.get("/insights", response_model=FinancialInsights)
def endpoint(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_insights(db, user.id)