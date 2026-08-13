from app.database import Base, engine, SessionLocal
from app.modules.categories.models.category import Category

DEFAULT_CATEGORIES = [
    ("Salario", "income", "briefcase"),
    ("Otros ingresos", "income", "plus-circle"),
    ("Comida", "expense", "utensils"),
    ("Transporte", "expense", "car"),
    ("Vivienda", "expense", "home"),
    ("Salud", "expense", "heart"),
    ("Entretenimiento", "expense", "film"),
    ("Educación", "expense", "book"),
    ("Otros gastos", "expense", "more-horizontal"),
]


def init_db() -> None:
    """Crea las tablas si no existen, y las categorias default del sistema si todavia no hay ninguna."""
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.query(Category).filter(Category.user_id.is_(None)).first()
        if not existing:
            for name, category_type, icon in DEFAULT_CATEGORIES:
                db.add(Category(name=name, category_type=category_type, icon=icon, user_id=None))
            db.commit()
    finally:
        db.close()
