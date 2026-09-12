import { useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import ConfirmModal from "../../../components/ConfirmModal";
import OverBudgetAlert from "../components/OverBudgetAlert";
import MonthSelector from "../components/MonthSelector";
import BudgetSummaryCard from "../components/BudgetSummaryCard";
import BudgetForm from "../components/BudgetForm";
import BudgetProgressList from "../components/BudgetProgressList";
import useBudgets, { buildMonthRange, todayMonth } from "../hooks/useBudgets";
import "../../../styles/forms.css";
import "../styles/Budgets.css";

const monthOptions = buildMonthRange();

export default function BudgetsPage() {
  const {
    categories,
    progress,
    summary,
    loading,
    selectedMonth,
    setSelectedMonth,
    isCurrentOrFutureMonth,
    overBudgetCategories,
    addBudget,
    saveBudget,
    removeBudget,
  } = useBudgets();

  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function openDeleteConfirm(item) {
    setBudgetToDelete(item);
    setShowDeleteConfirm(true);
  }

  async function handleDelete() {
    await removeBudget(budgetToDelete.id);
    setShowDeleteConfirm(false);
    setBudgetToDelete(null);
  }

  return (
    <AppLayout>
      <h1 className="dashboard__title">Presupuestos</h1>

      <OverBudgetAlert categories={overBudgetCategories} />

      <Panel title="Mes">
        <MonthSelector
          month={selectedMonth}
          monthOptions={monthOptions}
          todayMonth={todayMonth}
          isCurrentOrFutureMonth={isCurrentOrFutureMonth}
          onChange={setSelectedMonth}
        />
      </Panel>

      {summary && (
        <Panel title="Dinero disponible para presupuestar">
          <BudgetSummaryCard summary={summary} />
        </Panel>
      )}

      {isCurrentOrFutureMonth && (
        <Panel title="Definir presupuesto">
          <BudgetForm categories={categories} onSubmit={addBudget} />
        </Panel>
      )}

      <Panel title={`Progreso — ${selectedMonth}`}>
        {loading ? (
          <p className="budgets__empty">Cargando presupuestos...</p>
        ) : (
          <BudgetProgressList
            progress={progress}
            canEdit={isCurrentOrFutureMonth}
            onSave={saveBudget}
            onDelete={openDeleteConfirm}
          />
        )}
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
