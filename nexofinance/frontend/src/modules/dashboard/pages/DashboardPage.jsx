import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import AppLayout from "../../../components/AppLayout";
import BalanceCard from "../../../components/BalanceCard";
import ExpenseChart from "../../../components/ExpenseChart";
import Panel from "../../../components/Panel";
import InsightsPanel from "../components/InsightsPanel";
import {
  getDashboardSummary,
  getExpensesByCategory,
  getFinancialInsights,
} from "../api/dashboard";
import "../styles/Dashboard.css";
import "../styles/InsightsPanel.css";

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function Dashboard() {
  const [month, setMonth] = useState(currentMonth());

  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      getDashboardSummary(month),
      getExpensesByCategory(month),
      getFinancialInsights(month),
    ]).then(([summaryData, expensesData, insightsData]) => {
      if (cancelled) return;
      setSummary(summaryData);
      setExpenses(expensesData);
      setInsights(insightsData);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [month]);

  return (
    <AppLayout>
      <div className="dashboard__header">
        <h1 className="dashboard__title">Resumen</h1>

        <label className="dashboard__month-picker">
          <CalendarDays size={16} className="dashboard__month-icon" />
          <input
            type="month"
            value={month}
            max={currentMonth()}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
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