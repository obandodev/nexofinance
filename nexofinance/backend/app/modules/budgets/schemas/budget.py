from typing import Optional
from pydantic import BaseModel


class BudgetCreate(BaseModel):
    category_id: int
    month: str 
    limit_amount: float


class BudgetUpdate(BaseModel):
    limit_amount: Optional[float] = None


class BudgetOut(BaseModel):
    id: int
    category_id: int
    month: str
    limit_amount: float

    class Config:
        from_attributes = True


class BudgetProgress(BaseModel):
    id: int
    category_id: int
    category_name: str
    month: str
    limit_amount: float
    spent_amount: float
    remaining_amount: float