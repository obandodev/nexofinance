import AppLayout from "../../../components/AppLayout";
import BalanceCard from "../../../components/BalanceCard";
import ExpenseChart from "../../../components/ExpenseChart";
import Panel from "../../../components/Panel";
import InsightsPanel from "../components/InsightsPanel";
import MonthPicker from "../components/MonthPicker";
import useDashboard, { currentMonth } from "../hooks/useDashboard";
import "../styles/Dashboard.css";
import "../styles/InsightsPanel.css";

export default function DashboardPage() {
  const { month, setMonth, summary, expenses, insights, loading } = useDashboard();

  return (
    <AppLayout>
      <div className="dashboard__header">
        <h1 className="dashboard__title">Resumen</h1>
        <MonthPicker month={month} max={currentMonth()} onChange={setMonth} />
      </div>

      {loading ? (
        <div className="dashboard__state">
          <div className="dashboard__loader" />
          <p>Cargando tu resumen...</p>
        </div>
      ) : (
        <>
          {summary && (
            <BalanceCard
              total={summary.total_balance}
              income={summary.total_income_month}
              expense={summary.total_expense_month}
            />
          )}

          <div className="dashboard__grid">
            <Panel title="Gastos por categoría">
              <ExpenseChart data={expenses} />
            </Panel>
          </div>

          <Panel title="Coaching financiero">
            <InsightsPanel insights={insights} />
          </Panel>
        </>
      )}
    </AppLayout>
  );
}
