# NexoFinance

Plataforma multi-usuario para gestión financiera personal: cuentas, ingresos, gastos, presupuestos, metas de ahorro, deudas y préstamos. Cualquier persona puede registrarse y solo ve su propia información.

## Estructura

nexofinance/
├── backend/ API en FastAPI + PostgreSQL
└── frontend/ App en React + Vite


## Stack técnico

**Backend:** FastAPI, SQLAlchemy 2.0, PostgreSQL (`psycopg2-binary`), Alembic (migraciones), JWT (`python-jose`) + `passlib[bcrypt]` para autenticación, Pydantic v2.

**Frontend:** React 18 + Vite, `react-router-dom`, `axios`, `recharts` (gráficas), `lucide-react` (iconos).

## Identidad visual

- **Paleta:** fondo azul-negro profundo (#0B0E14), tarjetas (#141924), acento esmeralda (#00D9A3) para ingresos/positivo, ámbar (#F5A623) para gastos/alertas.
- **Tipografía:** Space Grotesk (títulos, números grandes) + Inter (cuerpo y datos).
- **Elemento signature:** el saldo total del dashboard se anima desde 0 hasta su valor real al cargar la página, con un resplandor esmeralda de fondo.

## Cómo levantar el backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env         # completar con tu DATABASE_URL real
uvicorn app.main:app --reload
```

API en `http://localhost:8000`, documentación interactiva en `http://localhost:8000/docs`.

Al iniciar por primera vez, el backend crea las tablas (`Base.metadata.create_all`) y las categorías por defecto del sistema (Comida, Transporte, Salario, etc.), disponibles para todos los usuarios.

### Variables de entorno del backend (`backend/.env`)

DATABASE_URL=postgresql://usuario:password@localhost:5432/nexofinance
JWT_SECRET_KEY=una_clave_secreta_larga_y_aleatoria
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
CORS_ORIGINS=http://localhost:5173


## Cómo levantar el frontend

```bash
cd frontend
npm install
cp .env.example .env         # completar con la URL de tu backend
npm run dev
```

Abrir `http://localhost:5173`, crear una cuenta desde "Creá una gratis" en el login.

### Variable de entorno del frontend (`frontend/.env`)

VITE_API_URL=http://localhost:8000


## Modelo de datos

- **User:** cualquier persona registrada, sin roles fijos.
- **Account:** cuentas del usuario (ahorros, corriente, efectivo), cada una con su saldo. El saldo no se edita manualmente, solo cambia por transacciones, transferencias, aportes o pagos.
- **Category:** categorías de ingreso/gasto — hay defaults del sistema (`user_id = NULL`) y el usuario puede crear las propias.
- **Transaction:** movimientos de dinero (ingreso/gasto), afectan el saldo de la cuenta automáticamente. Se pueden anular (`is_voided`) sin borrarse.
- **Transfer:** movimiento de saldo entre dos cuentas del mismo usuario.
- **Budget:** límite mensual de gasto por categoría.
- **SavingsGoal / SavingsContribution:** metas de ahorro con aportes; una meta se puede anular (estado `CANCELLED`) si no tiene aportes activos.
- **Debt / DebtPayment:** deudas propias (`debt_type = "debt"`) o préstamos hechos a terceros (`debt_type = "loan"`), con sus pagos/cobros asociados. Estados: `PENDING`, `PARTIAL`, `PAID`, `CANCELLED`. Una deuda solo se puede anular si todavía no tiene pagos registrados.

## Aislamiento de datos (multi-tenancy)

Cada tabla de negocio tiene un campo `user_id`. Todos los endpoints filtran automáticamente por el usuario del token de sesión — nadie puede ver ni modificar datos de otra cuenta, sin excepciones.

## Arquitectura modular

El proyecto está organizado por dominio. Cada módulo del backend agrupa su modelo, schemas, repository, validators, services y routers. Cada endpoint vive en su propio archivo y los routers de módulo solo componen esos endpoints.

```text
backend/app/modules/
├── accounts/       Cuentas del usuario
├── auth/           Registro, login, sesión
├── budgets/        Presupuestos mensuales por categoría
├── categories/     Categorías de ingreso/gasto
├── dashboard/      Resumen general para el usuario
├── debts/          Deudas y préstamos (con pagos y anulación)
├── savings/        Metas de ahorro y aportes
├── transactions/   Ingresos y gastos
└── transfers/      Transferencias entre cuentas
```

El frontend sigue la misma idea con módulos por funcionalidad:

```text
frontend/src/modules/
├── accounts/
├── auth/
├── budgets/
├── categories/
├── dashboard/
├── debt/
├── goals/
├── transactions/
└── transfers/
```

Los componentes genéricos como `AppLayout`, `Panel`, `Modal`, `ConfirmModal` y `SuccessModal` permanecen compartidos. Los iconos de interfaz utilizan `lucide-react`.

### Endpoints por módulo

**`/debts`**

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/debts/` | Lista deudas/préstamos del usuario, con `paid_amount` y `pending_amount` calculados |
| POST | `/debts/` | Crea una deuda o préstamo |
| PATCH | `/debts/{id}` | Edita nombre, monto total o fecha límite |
| POST | `/debts/{id}/cancel` | Anula una deuda (solo si no tiene pagos registrados) |
| POST | `/debts/{id}/payments` | Registra un pago (si `debt`) o cobro (si `loan`); afecta el saldo de la cuenta |
| GET | `/debts/{id}/payments` | Lista los pagos/cobros de una deuda |

**`/savings-goals`**

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/savings-goals/` | Lista metas de ahorro |
| POST | `/savings-goals/` | Crea una meta |
| PATCH | `/savings-goals/{id}` | Edita una meta |
| POST | `/savings-goals/{id}/cancel` | Anula una meta (solo si no tiene aportes activos) |
| POST | `/savings-goals/{id}/contributions` | Registra un aporte |
| GET | `/savings-goals/{id}/contributions` | Lista los aportes de una meta |
| PATCH | `/savings-goals/contributions/{id}` | Edita un aporte |
| POST | `/savings-goals/contributions/{id}/cancel` | Anula un aporte |

**`/accounts`, `/categories`, `/transactions`, `/transfers`, `/budgets`, `/dashboard`, `/auth`**

CRUD estándar por dominio, siguiendo la misma convención modular (un archivo por endpoint dentro de `routers/`).

## Migraciones (Alembic)

El primer arranque del backend crea las tablas automáticamente vía SQLAlchemy (`Base.metadata.create_all` en `app/startup.py`), **no** vía Alembic. Alembic (`backend/migrations/`) se usa para versionar cambios de esquema posteriores a esa creación inicial:

```bash
cd backend
alembic revision --autogenerate -m "descripcion del cambio"
alembic upgrade head
```

## Despliegue sugerido

- **Backend + base de datos:** Railway o Render (PostgreSQL administrado).
- **Frontend:** Netlify.

Configurar `CORS_ORIGINS` en el backend con la URL real del frontend, y `VITE_API_URL` en el frontend con la URL real del backend.

#A