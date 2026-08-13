from fastapi import APIRouter
from .list_categories import router as list_router
from .create_category import router as create_router
from .delete_category import router as delete_router
router=APIRouter(prefix="/categories", tags=["categories"])
router.include_router(list_router); router.include_router(create_router); router.include_router(delete_router)
