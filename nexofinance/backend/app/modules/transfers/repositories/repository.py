from sqlalchemy.orm import Session
from app.modules.transfers.models.transfer import Transfer

def list_for_user(db: Session, user_id: int):
    return db.query(Transfer).filter(Transfer.user_id == user_id).order_by(Transfer.transfer_date.desc()).all()
