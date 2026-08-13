from fastapi import APIRouter
from .summary import router as summary_router
from .expenses_by_category import router as expenses_router
router=APIRouter(prefix="/dashboard",tags=["dashboard"])
router.include_router(summary_router);router.include_router(expenses_router)
