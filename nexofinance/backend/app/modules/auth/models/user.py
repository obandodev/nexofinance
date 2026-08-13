from sqlalchemy import Column, Integer, String, DateTime, func

from app.database import Base


class User(Base):
    """Cualquier persona que se registra en NexoFinance. Sin roles de negocio: cada quien ve solo lo suyo."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    recovery_code_hash = Column(String, nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())