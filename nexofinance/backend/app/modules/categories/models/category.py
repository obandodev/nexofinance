from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Category(Base):
    """Categoria de ingreso o gasto. user_id nulo = categoria default del sistema, visible para todos."""

    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)  # null = categoria del sistema
    name = Column(String, nullable=False)
    category_type = Column(String, nullable=False)  # income | expense
    icon = Column(String, nullable=True)             # nombre de icono opcional para el frontend

    owner = relationship("User")
