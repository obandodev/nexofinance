from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.categories.schemas.category import CategoryUpdate, CategoryOut
from app.modules.categories.services.category_service import update_category

router = APIRouter()

@router.patch("/{category_id}", response_model=CategoryOut)
def endpoint(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return update_category(db, category_id, data, user.id)