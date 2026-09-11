from sqlalchemy.orm import Session
from app.modules.auth.models.user import User

def get_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()