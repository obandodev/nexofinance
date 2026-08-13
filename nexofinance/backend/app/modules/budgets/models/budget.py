from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Budget(Base):
    """Presupuesto mensual maximo para una categoria (ej: 'Comida: $400.000 en 2026-07')."""

    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    month = Column(String, nullable=False)  # formato "YYYY-MM"
    limit_amount = Column(Float, nullable=False)

    category = relationship("Category")
