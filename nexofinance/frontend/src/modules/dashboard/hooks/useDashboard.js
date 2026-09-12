import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getExpensesByCategory,
  getFinancialInsights,
} from "../api/dashboard";

export function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function useDashboard() {
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

  return {
    month,
    setMonth,
    summary,
    expenses,
    insights,
    loading,
  };
}
