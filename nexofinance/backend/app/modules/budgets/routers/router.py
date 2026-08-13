from fastapi import APIRouter
from .list_budgets import router as list_router
from .create_budget import router as create_router
from .update_budget import router as update_router
from .delete_budget import router as delete_router
from .summary import router as summary_router
from .months import router as months_router
from .progress import router as progress_router
router=APIRouter(prefix="/budgets",tags=["budgets"])
router.include_router(list_router); router.include_router(create_router); router.include_router(update_router); router.include_router(delete_router)
router.include_router(summary_router); router.include_router(months_router); router.include_router(progress_router)
