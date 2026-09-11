from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.modules.auth.models.user import User

from app.modules.transactions.schemas.transaction import TransactionPage
from app.modules.transactions.services.transaction_service import get_transactions

router = APIRouter()


@router.get("/", response_model=TransactionPage)
def endpoint(
    account_id: Optional[int] = None,
    category_id: Optional[int] = None,
    transaction_type: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    search: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_transactions(
        db,
        user.id,
        account_id,
        category_id,
        transaction_type,
        date_from,
        date_to,
        search,
        page,
        page_size,
    )