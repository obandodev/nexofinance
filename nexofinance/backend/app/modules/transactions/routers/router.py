from fastapi import APIRouter
from .list_transactions import router as list_router
from .create_transaction import router as create_router
from .void_transaction import router as void_router
router=APIRouter(prefix="/transactions",tags=["transactions"])
router.include_router(list_router);router.include_router(create_router);router.include_router(void_router)
