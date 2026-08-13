from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class SavingsGoalCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    target_amount: float = Field(gt=0)
    target_date: Optional[date] = None

class SavingsGoalUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    target_amount: Optional[float] = Field(default=None, gt=0)
    target_date: Optional[date] = None

class SavingsGoalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    target_amount: float
    current_amount: float
    target_date: Optional[date]
    status: str

class SavingsContributionCreate(BaseModel):
    account_id: int
    amount: float = Field(gt=0)
    contribution_date: date

class SavingsContributionUpdate(BaseModel):
    account_id: Optional[int] = None
    amount: Optional[float] = Field(default=None, gt=0)
    contribution_date: Optional[date] = None

class SavingsContributionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    goal_id: int
    account_id: int
    amount: float
    contribution_date: date
    status: str
