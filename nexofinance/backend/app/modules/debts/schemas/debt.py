from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict


class DebtCreate(BaseModel):
    name: str
    debt_type: str
    total_amount: float
    due_date: Optional[date] = None


class DebtUpdate(BaseModel):
    name: Optional[str] = None
    total_amount: Optional[float] = None
    due_date: Optional[date] = None


class DebtOut(BaseModel):
    id: int
    name: str
    debt_type: str
    total_amount: float
    paid_amount: float
    pending_amount: float
    status: str
    due_date: Optional[date] = None

    model_config = ConfigDict(
        from_attributes=True
    )