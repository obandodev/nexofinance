import client from "../../../core/api/client";

export async function getDashboardSummary() {
  const response = await client.get("/dashboard/summary");
  return response.data;
}

export async function getExpensesByCategory(month) {
  const response = await client.get("/dashboard/expenses-by-category", {
    params: month ? { month } : {},
  });
  return response.data;
}
