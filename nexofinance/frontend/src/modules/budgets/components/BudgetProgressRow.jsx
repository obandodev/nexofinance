import { useState } from "react";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function BudgetProgressRow({ item, canEdit, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(item.limit_amount);
  const [error, setError] = useState("");

  const percent = Math.min((item.spent_amount / item.limit_amount) * 100, 100);
  const isOver = item.spent_amount > item.limit_amount;

  function startEdit() {
    setEditAmount(item.limit_amount);
    setError("");
    setIsEditing(true);
  }

  async function handleSave() {
    setError("");

    try {
      await onSave(item.id, { limit_amount: Number(editAmount) });
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || "No se pudo actualizar el presupuesto");
    }
  }

  return (
    <div className="budget-bar">
      <div className="budget-bar__header">
        <span>{item.category_name}</span>

        {isEditing ? (
          <span className="budget-bar__edit-row">
            <input
              className="budget-bar__edit-input"
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
            />
            <button className="form-submit" onClick={handleSave}>
              Guardar
            </button>
            <button className="filters-bar__clear" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </span>
        ) : (
          <span className="budget-bar__edit-row">
            <span className={isOver ? "budget-bar__over" : ""}>
              {formatCurrency(item.spent_amount)} / {formatCurrency(item.limit_amount)}
            </span>

            {canEdit && (
              <>
                <button className="filters-bar__clear" onClick={startEdit}>
                  Editar
                </button>
                <button className="filters-bar__clear" onClick={() => onDelete(item)}>
                  Eliminar
                </button>
              </>
            )}
          </span>
        )}
      </div>

      {error && (
        <p style={{ color: "var(--red)", fontSize: "var(--text-sm)", marginTop: "0.4rem" }}>
          {error}
        </p>
      )}

      <div className="budget-bar__track">
        <div
          className="budget-bar__fill"
          style={{ width: `${percent}%`, background: isOver ? "var(--red)" : "var(--emerald)" }}
        />
      </div>
    </div>
  );
}
