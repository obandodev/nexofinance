from sqlalchemy.orm import Session
from app.modules.auth.models.user import User

def get_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()
