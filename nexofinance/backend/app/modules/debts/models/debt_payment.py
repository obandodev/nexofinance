from sqlalchemy import (
    Column,
    Integer,
    Float,
    Date,
    ForeignKey,
    String,
)
from sqlalchemy.orm import relationship

from app.database import Base


class DebtPayment(Base):
    """
    Registro de un pago o abono realizado sobre una deuda.

    Si debt_type = debt:
        representa un pago que YO hice.

    Si debt_type = loan:
        representa un pago que ALGUIEN ME HIZO.
    """

    __tablename__ = "debt_payments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    debt_id = Column(
        Integer,
        ForeignKey("debts.id"),
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

    payment_date = Column(
        Date,
        nullable=False,
    )

    note = Column(
        String,
        nullable=True,
    )

    debt = relationship(
        "Debt",
        back_populates="payments",
    )

    account = relationship(
        "Account",
    )