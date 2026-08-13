from fastapi import APIRouter
from .signup import router as signup_router
from .login import router as login_router
from .recover_password import router as recover_router
router=APIRouter(prefix="/auth",tags=["auth"])
router.include_router(signup_router);router.include_router(login_router);router.include_router(recover_router)
