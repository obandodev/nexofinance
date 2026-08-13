from fastapi import HTTPException
from app.modules.categories.models.category import Category
from app.modules.categories.repositories.repository import list_for_user, get
from app.modules.transactions.models.transaction import Transaction
from app.modules.budgets.models.budget import Budget
from app.modules.categories.validators import validate_custom_category

def list_categories(db, user_id): return list_for_user(db, user_id)

def create_category(db, data, user_id):
    category = Category(**data.model_dump(), user_id=user_id)
    db.add(category); db.commit(); db.refresh(category); return category

def delete_category(db, category_id, user_id):
    category = get(db, category_id)
    if not category: raise HTTPException(status_code=404, detail="Categoría no encontrada")
    validate_custom_category(category, user_id)
    if db.query(Transaction).filter(Transaction.category_id == category_id).first():
        raise HTTPException(status_code=400, detail="No se puede eliminar: ya tenés transacciones registradas con esta categoría")
    if db.query(Budget).filter(Budget.category_id == category_id).first():
        raise HTTPException(status_code=400, detail="No se puede eliminar: ya tenés presupuestos definidos con esta categoría")
    db.delete(category); db.commit()
    return {"deleted": True}
