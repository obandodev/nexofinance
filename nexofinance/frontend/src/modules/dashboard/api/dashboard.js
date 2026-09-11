import client from "../../../core/api/client";

export async function getDashboardSummary(month) {
  const response = await client.get("/dashboard/summary", {
    params: month ? { month } : {},
  });
  return response.data;
}

export async function getExpensesByCategory(month) {
  const response = await client.get("/dashboard/expenses-by-category", {
    params: month ? { month } : {},
  });
  return response.data;
}

export async function getFinancialInsights(month) {
  const response = await client.get("/dashboard/insights", {
    params: month ? { month } : {},
  });
  return response.data;
}