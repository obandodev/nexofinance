from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User
from app.modules.categories.schemas.category import CategoryCreate, CategoryOut
from app.modules.categories.services.category_service import create_category
router=APIRouter()
@router.post("/", response_model=CategoryOut)
def endpoint(data: CategoryCreate, db: Session=Depends(get_db), user: User=Depends(get_current_user)): return create_category(db,data,user.id)
