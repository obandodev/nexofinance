from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict

class DebtPaymentCreate(BaseModel):
    account_id: int
    amount: float
    payment_date: date
    note: Optional[str] = None


class DebtPaymentUpdate(BaseModel):
    amount: Optional[float] = None
    payment_date: Optional[date] = None
    note: Optional[str] = None


class DebtPaymentOut(BaseModel):
    id: int
    debt_id: int
    account_id: int
    account_name: str
    amount: float
    payment_date: date
    note: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True
    )