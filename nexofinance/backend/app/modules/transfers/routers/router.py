from fastapi import APIRouter
from .list_transfers import router as list_router
from .create_transfer import router as create_router
router=APIRouter(prefix="/transfers",tags=["transfers"])
router.include_router(list_router);router.include_router(create_router)
