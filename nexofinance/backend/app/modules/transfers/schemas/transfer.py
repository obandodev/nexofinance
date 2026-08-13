from datetime import date
from typing import Optional
from pydantic import BaseModel


class TransferCreate(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: float
    note: Optional[str] = None
    transfer_date: date


class TransferOut(BaseModel):
    id: int
    from_account_id: int
    to_account_id: int
    amount: float
    note: Optional[str]
    transfer_date: date

    class Config:
        from_attributes = True