# NexoFinance

Plataforma multi-usuario para gestión financiera personal: cuentas, ingresos, gastos, presupuestos, metas de ahorro y deudas. Cualquier persona puede registrarse y solo ve su propia información.

## Estructura

```
nexofinance/
├── backend/     API en FastAPI + PostgreSQL
└── frontend/    App en React + Vite
```

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

Al iniciar por primera vez, el backend crea las tablas y las categorías por defecto del sistema (Comida, Transporte, Salario, etc.), disponibles para todos los usuarios.

## Cómo levantar el frontend

```bash
cd frontend
npm install
cp .env.example .env         # completar con la URL de tu backend
npm run dev
```

Abrir `http://localhost:5173`, crear una cuenta desde "Creá una gratis" en el login.

## Modelo de datos

- **User:** cualquier persona registrada, sin roles fijos.
- **Account:** cuentas del usuario (ahorros, corriente, efectivo), cada una con su saldo.
- **Category:** categorías de ingreso/gasto — hay defaults del sistema y el usuario puede crear las propias.
- **Transaction:** movimientos de dinero, afectan el saldo de la cuenta automáticamente.
- **Budget:** límite mensual de gasto por categoría.
- **SavingsGoal:** metas de ahorro con progreso.
- **Debt:** deudas propias o préstamos hechos a terceros.

## Aislamiento de datos (multi-tenancy)

Cada tabla de negocio tiene un campo `user_id`. Todos los endpoints filtran automáticamente por el usuario del token de sesión — nadie puede ver ni modificar datos de otra cuenta, sin excepciones.

## Despliegue sugerido

- **Backend + base de datos:** Railway o Render (PostgreSQL administrado).
- **Frontend:** Netlify.

Configurar `CORS_ORIGINS` en el backend con la URL real del frontend, y `VITE_API_URL` en el frontend con la URL real del backend.

## Arquitectura modular

El proyecto está organizado por dominio. Cada módulo del backend agrupa su modelo, schemas, repository, validators, services y routers. Cada endpoint vive en su propio archivo y los routers de módulo solo componen esos endpoints.

```text
backend/app/modules/
├── accounts/
├── auth/
├── budgets/
├── categories/
├── dashboard/
├── debts/
├── savings/
├── transactions/
└── transfers/
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

### Dependencia nueva del frontend

Después de obtener esta versión, ejecutar:

```bash
cd frontend
npm install
```

Esto instala `lucide-react` y mantiene el `package-lock.json` alineado.

### Nota sobre deudas

La página de deudas fue trasladada al módulo `frontend/src/modules/debt/`, pero su rediseño funcional queda pendiente para la siguiente etapa.
