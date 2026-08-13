from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Debt(Base):
    """
    Deuda o dinero prestado.
    
    debt_type:
    - debt: dinero que yo debo
    - loan: dinero que me deben
    """

    __tablename__ = "debts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    name = Column(String, nullable=False)

    debt_type = Column(String, nullable=False)

    total_amount = Column(Float, nullable=False)

    paid_amount = Column(
        Float,
        nullable=False,
        default=0,
    )

    due_date = Column(
        Date,
        nullable=True,
    )

    status = Column(
        String(20),
        nullable=False,
        default="ACTIVE",
    )

    payments = relationship(
        "DebtPayment",
        back_populates="debt",
        cascade="all, delete-orphan",
    )