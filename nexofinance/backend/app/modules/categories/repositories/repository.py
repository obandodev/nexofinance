from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.modules.categories.models.category import Category

def list_for_user(db: Session, user_id: int):
    return db.query(Category).filter(or_(Category.user_id.is_(None), Category.user_id == user_id)).all()

def get(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()
