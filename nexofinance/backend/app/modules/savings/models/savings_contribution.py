from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey,
    DateTime,
    Date,
    String,
    func,
)
from sqlalchemy.orm import relationship

from app.database import Base


class SavingsContribution(Base):
    """
    Aporte de dinero realizado desde una cuenta hacia una meta de ahorro.
    """

    __tablename__ = "savings_contributions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    goal_id = Column(
        Integer,
        ForeignKey("savings_goals.id"),
        nullable=False,
        index=True,
    )

    account_id = Column(
        Integer,
        ForeignKey("accounts.id"),
        nullable=False,
        index=True,
    )

    amount = Column(
        Float,
        nullable=False,
    )

    contribution_date = Column(
        Date,
        nullable=False,
    )

    status = Column(
        String,
        nullable=False,
        default="ACTIVE",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    goal = relationship("SavingsGoal")

    account = relationship("Account")
