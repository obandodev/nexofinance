from fastapi import APIRouter
from .list_accounts import router as list_router
from .create_account import router as create_router
from .update_account import router as update_router
from .activate_account import router as activate_router
from .deactivate_account import router as deactivate_router
router=APIRouter(prefix="/accounts", tags=["accounts"])
router.include_router(list_router); router.include_router(create_router); router.include_router(update_router)
router.include_router(activate_router); router.include_router(deactivate_router)
