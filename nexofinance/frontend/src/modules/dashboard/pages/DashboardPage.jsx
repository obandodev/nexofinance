import { useEffect, useState } from "react";
import AppLayout from "../../../components/AppLayout";
import BalanceCard from "../../../components/BalanceCard";
import ExpenseChart from "../../../components/ExpenseChart";
import Panel from "../../../components/Panel";
import { getDashboardSummary, getExpensesByCategory } from "../api/dashboard";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getDashboardSummary().then(setSummary);
    getExpensesByCategory().then(setExpenses);
  }, []);

  return (
    <AppLayout>
      <h1 className="dashboard__title">Resumen</h1>

      {summary && (
        <BalanceCard
          total={summary.total_balance}
          income={summary.total_income_month}
          expense={summary.total_expense_month}
        />
      )}

      <div className="dashboard__grid">
        <Panel title="Gastos por categoría (este mes)">
          <ExpenseChart data={expenses} />
        </Panel>
      </div>
    </AppLayout>
  );
}
