import client from "../../../core/api/client";

export async function getTransactions(filters = {}) {
  const response = await client.get("/transactions/", { params: filters });
  return response.data;
}

export async function createTransaction(transaction) {
  const response = await client.post("/transactions/", transaction);
  return response.data;
}

export async function voidTransaction(id, reason) {
  const response = await client.patch(`/transactions/${id}/void`, { reason });
  return response.data;
}