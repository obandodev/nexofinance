from fastapi import APIRouter
from .list_goals import router as list_goals_router
from .create_goal import router as create_goal_router
from .update_goal import router as update_goal_router
from .cancel_goal import router as cancel_goal_router
from .add_contribution import router as add_contribution_router
from .list_contributions import router as list_contributions_router
from .update_contribution import router as update_contribution_router
from .cancel_contribution import router as cancel_contribution_router
router=APIRouter(prefix="/savings-goals",tags=["savings-goals"])
router.include_router(list_goals_router);router.include_router(create_goal_router);router.include_router(update_goal_router);router.include_router(cancel_goal_router)
router.include_router(add_contribution_router);router.include_router(list_contributions_router);router.include_router(update_contribution_router);router.include_router(cancel_contribution_router)
