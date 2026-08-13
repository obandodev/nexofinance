from typing import Optional
from pydantic import BaseModel


class AccountCreate(BaseModel):
    name: str
    account_type: str
    currency: str = "COP"
    balance: float = 0


class AccountUpdate(BaseModel):
    """
    El saldo NO se puede editar manualmente.
    Solo se permite editar el nombre y el tipo de cuenta.
    """
    name: Optional[str] = None
    account_type: Optional[str] = None


class AccountOut(BaseModel):
    id: int
    name: str
    account_type: str
    currency: str
    balance: float
    status: str

    class Config:
        from_attributes = True