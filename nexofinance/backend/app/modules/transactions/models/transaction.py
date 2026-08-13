from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, func
from sqlalchemy.orm import relationship

from app.database import Base


class Transaction(Base):
    """Un movimiento de dinero: ingreso o gasto. Nunca se borra: se anula, dejando rastro."""

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    transaction_type = Column(String, nullable=False)  # income | expense
    amount = Column(Float, nullable=False)
    note = Column(String, nullable=True)
    transaction_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    is_voided = Column(Integer, nullable=False, default=0)
    voided_at = Column(DateTime(timezone=True), nullable=True)
    void_reason = Column(String, nullable=True)

    account = relationship("Account")
    category = relationship("Category")