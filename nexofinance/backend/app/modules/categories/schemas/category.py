from typing import Optional
from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    category_type: str  # income | expense
    icon: Optional[str] = None


class CategoryOut(BaseModel):
    id: int
    name: str
    category_type: str
    icon: Optional[str]
    user_id: Optional[int]  # None = categoria default del sistema

    class Config:
        from_attributes = True
