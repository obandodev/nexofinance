from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.startup import init_db
from app.modules.auth.routers import router as auth_router
from app.modules.accounts.routers import router as accounts_router
from app.modules.categories.routers import router as categories_router
from app.modules.transactions.routers import router as transactions_router
from app.modules.budgets.routers import router as budgets_router
from app.modules.savings.routers import router as savings_router
from app.modules.debts.routers import router as debts_router
from app.modules.dashboard.routers import router as dashboard_router
from app.modules.transfers.routers import router as transfers_router

app = FastAPI(title="NexoFinance API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(accounts_router)
app.include_router(categories_router)
app.include_router(transactions_router)
app.include_router(budgets_router)
app.include_router(savings_router)
app.include_router(debts_router)
app.include_router(dashboard_router)
app.include_router(transfers_router)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def health_check():
    return {"status": "ok", "service": "NexoFinance API"}
