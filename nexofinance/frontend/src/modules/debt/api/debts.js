import client from "../../../core/api/client";

export async function getDebts() {
  const response = await client.get("/debts/");
  return response.data;
}

export async function createDebt(debt) {
  const response = await client.post("/debts/", debt);
  return response.data;
}

export async function updateDebt(id, changes) {
  const response = await client.patch(`/debts/${id}`, changes);
  return response.data;
}

export async function getDebtPayments(debtId) {
  const response = await client.get(`/debts/${debtId}/payments`);
  return response.data;
}

export async function createDebtPayment(debtId, payment) {
  const response = await client.post(
    `/debts/${debtId}/payments`,
    payment
  );

  return response.data;
}