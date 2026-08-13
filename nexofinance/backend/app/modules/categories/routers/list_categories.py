from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.categories.schemas.category import CategoryOut
from app.modules.categories.services.category_service import list_categories
router=APIRouter()
@router.get("/", response_model=list[CategoryOut])
def endpoint(db: Session=Depends(get_db), user: User=Depends(get_current_user)): return list_categories(db,user.id)
