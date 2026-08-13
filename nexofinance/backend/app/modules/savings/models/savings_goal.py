from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey

from app.database import Base


class SavingsGoal(Base):
    """
    Meta de ahorro.

    Ejemplo:
    Viaje a Cartagena -> $2.000.000
    """

    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    target_amount = Column(
        Float,
        nullable=False,
    )

    current_amount = Column(
        Float,
        nullable=False,
        default=0,
    )

    target_date = Column(
        Date,
        nullable=True,
    )

    status = Column(
        String,
        nullable=False,
        default="ACTIVE",
    )
