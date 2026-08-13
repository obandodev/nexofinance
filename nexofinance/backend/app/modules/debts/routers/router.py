from fastapi import APIRouter

from .list_debts import router as list_router
from .create_debt import router as create_router
from .update_debt import router as update_router

from .create_payment import router as create_payment_router
from .list_payments import router as list_payments_router


router = APIRouter(
    prefix="/debts",
    tags=["debts"],
)


router.include_router(
    list_router
)

router.include_router(
    create_router
)

router.include_router(
    update_router
)

router.include_router(
    create_payment_router
)

router.include_router(
    list_payments_router
)