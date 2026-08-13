import client from "../../../core/api/client";

export async function getBudgets(month) {
  const response = await client.get("/budgets/", { params: month ? { month } : {} });
  return response.data;
}

export async function createBudget(budget) {
  const response = await client.post("/budgets/", budget);
  return response.data;
}

export async function updateBudget(id, changes) {
  const response = await client.patch(`/budgets/${id}`, changes);
  return response.data;
}

export async function getBudgetProgress(month) {
  const response = await client.get(`/budgets/progress/${month}`);
  return response.data;
}

export async function getAvailableMonths() {
  const response = await client.get("/budgets/months");
  return response.data;
}

export async function deleteBudget(id) {
  await client.delete(`/budgets/${id}`);
}

export async function getBudgetSummary(month) {
  const response = await client.get(`/budgets/summary/${month}`);
  return response.data;
}