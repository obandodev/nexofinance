from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class TransactionCreate(BaseModel):
    account_id: int
    category_id: int
    transaction_type: str  # income | expense
    amount: float
    note: Optional[str] = None
    transaction_date: date


class VoidRequest(BaseModel):
    reason: Optional[str] = None


class TransactionOut(BaseModel):
    id: int
    account_id: int
    category_id: int
    transaction_type: str
    amount: float
    note: Optional[str]
    transaction_date: date
    is_voided: int
    voided_at: Optional[datetime]
    void_reason: Optional[str]

    class Config:
        from_attributes = True