import { useEffect, useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import ConfirmModal from "../../../components/ConfirmModal";
import { getCategories } from "../../categories/api/categories";
import { createBudget, updateBudget, deleteBudget, getBudgetProgress, getBudgetSummary } from "../api/budgets";
import "../../../styles/forms.css";
import "../styles/Budgets.css";

function formatCurrency(value) {
  return value.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

const todayMonth = new Date().toISOString().slice(0, 7);

function buildMonthRange() {
  const months = [];
  const [year, month] = todayMonth.split("-").map(Number);

  for (let offset = 0; offset <= 11; offset++) {
    const date = new Date(year, month - 1 + offset, 1);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${m}`);
  }
  return months;
}

export default function Budgets() {
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(todayMonth);
  const monthOptions = buildMonthRange();

  const [categoryId, setCategoryId] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [createError, setCreateError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editError, setEditError] = useState("");

  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function loadProgress(month) {
    getBudgetProgress(month).then(setProgress);
  }

  function loadSummary(month) {
    getBudgetSummary(month).then(setSummary);
  }

  function loadAll(month) {
    loadProgress(month);
    loadSummary(month);
  }

  useEffect(() => {
    getCategories().then((all) => setCategories(all.filter((c) => c.category_type === "expense")));
  }, []);

  useEffect(() => {
    loadAll(selectedMonth);
  }, [selectedMonth]);

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError("");
    try {
      await createBudget({ category_id: Number(categoryId), month: selectedMonth, limit_amount: Number(limitAmount) });
      setLimitAmount("");
      setCategoryId("");
      loadAll(selectedMonth);
    } catch (err) {
      setCreateError(err.response?.data?.detail || "No se pudo crear el presupuesto");
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditAmount(item.limit_amount);
    setEditError("");
  }

  async function handleSaveEdit() {
    setEditError("");
    try {
      await updateBudget(editingId, { limit_amount: Number(editAmount) });
      setEditingId(null);
      loadAll(selectedMonth);
    } catch (err) {
      setEditError(err.response?.data?.detail || "No se pudo actualizar el presupuesto");
    }
  }

  function openDeleteConfirm(item) {
    setBudgetToDelete(item);
    setShowDeleteConfirm(true);
  }

  async function handleDelete() {
    await deleteBudget(budgetToDelete.id);
    setShowDeleteConfirm(false);
    setBudgetToDelete(null);
    loadAll(selectedMonth);
  }

  const isCurrentOrFutureMonth = selectedMonth >= todayMonth;
  const overBudgetCategories = progress.filter((p) => p.spent_amount > p.limit_amount);

  return (
    <AppLayout>
      <h1 className="dashboard__title">Presupuestos</h1>

      {overBudgetCategories.length > 0 && (
        <div className="budget-alert">
          <span className="budget-alert__icon">⚠</span>
          <div>
            <strong>Te pasaste del presupuesto en {overBudgetCategories.length} {overBudgetCategories.length === 1 ? "categoría" : "categorías"}:</strong>
            <ul className="budget-alert__list">
              {overBudgetCategories.map((p) => (
                <li key={p.id}>
                  {p.category_name}: {formatCurrency(p.spent_amount)} de {formatCurrency(p.limit_amount)} presupuestados
                  ({formatCurrency(p.spent_amount - p.limit_amount)} de más)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Panel title="Mes">
        <div className="filters-bar">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {monthOptions.map((m) => (
              <option key={m} value={m}>{m}{m === todayMonth ? " (actual)" : ""}</option>
            ))}
          </select>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            title="Buscar cualquier mes, pasado o futuro"
          />
        </div>
        <p className="budgets__hint">
          {isCurrentOrFutureMonth
            ? "Podés crear, editar o eliminar presupuestos para este mes."
            : "Estás viendo el historial de un mes anterior (solo lectura)."}
        </p>
      </Panel>

      {summary && (
        <Panel title="Dinero disponible para presupuestar">
          <div className="budget-summary">
            <div className="budget-summary__item">
              <span className="budget-summary__label">Saldo total en tus cuentas</span>
              <span className="budget-summary__value">{formatCurrency(summary.available_balance)}</span>
            </div>
            <div className="budget-summary__item">
              <span className="budget-summary__label">Ya asignado a presupuestos</span>
              <span className="budget-summary__value">{formatCurrency(summary.total_budgeted)}</span>
            </div>
            <div className="budget-summary__item">
              <span className="budget-summary__label">Libre para presupuestar</span>
              <span className={`budget-summary__value ${summary.unallocated < 0 ? "budget-bar__over" : ""}`}>
                {formatCurrency(summary.unallocated)}
              </span>
            </div>
          </div>
        </Panel>
      )}

      {isCurrentOrFutureMonth && (
        <Panel title="Definir presupuesto">
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="">Categoría</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input placeholder="Límite mensual" type="number" value={limitAmount} onChange={(e) => setLimitAmount(e.target.value)} required />
            </div>
            {createError && <p style={{ color: "var(--red)", fontSize: "var(--text-sm)" }}>{createError}</p>}
            <button className="form-submit" type="submit">Guardar presupuesto</button>
          </form>
        </Panel>
      )}

      <Panel title={`Progreso — ${selectedMonth}`}>
        {progress.length === 0 && <p className="budgets__empty">No hay presupuestos definidos para este mes.</p>}

        {editError && <p style={{ color: "var(--red)", fontSize: "var(--text-sm)", marginBottom: "0.5rem" }}>{editError}</p>}

        {progress.map((p) => {
          const percent = Math.min((p.spent_amount / p.limit_amount) * 100, 100);
          const isOver = p.spent_amount > p.limit_amount;
          const isEditing = editingId === p.id;

          return (
            <div className="budget-bar" key={p.id}>
              <div className="budget-bar__header">
                <span>{p.category_name}</span>

                {isEditing ? (
                  <span className="budget-bar__edit-row">
                    <input
                      className="budget-bar__edit-input"
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                    />
                    <button className="form-submit" onClick={handleSaveEdit}>Guardar</button>
                    <button className="filters-bar__clear" onClick={() => setEditingId(null)}>Cancelar</button>
                  </span>
                ) : (
                  <span className="budget-bar__edit-row">
                    <span className={isOver ? "budget-bar__over" : ""}>
                      {formatCurrency(p.spent_amount)} / {formatCurrency(p.limit_amount)}
                    </span>
                    {isCurrentOrFutureMonth && (
                      <>
                        <button className="filters-bar__clear" onClick={() => startEdit(p)}>Editar</button>
                        <button className="filters-bar__clear" onClick={() => openDeleteConfirm(p)}>Eliminar</button>
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="budget-bar__track">
                <div
                  className="budget-bar__fill"
                  style={{ width: `${percent}%`, background: isOver ? "var(--red)" : "var(--emerald)" }}
                />
              </div>
            </div>
          );
        })}
      </Panel>

      {budgetToDelete && (
        <ConfirmModal
          open={showDeleteConfirm}
          title="Eliminar presupuesto"
          message={`¿Seguro que querés eliminar el presupuesto de "${budgetToDelete.category_name}"?`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => {
            setBudgetToDelete(null);
            setShowDeleteConfirm(false);
          }}
        />
      )}
    </AppLayout>
  );
}