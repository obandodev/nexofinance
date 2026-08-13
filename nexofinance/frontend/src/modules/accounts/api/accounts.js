import client from "../../../core/api/client";

export async function getAccounts() {
  const response = await client.get("/accounts/");
  return response.data;
}

export async function createAccount(account) {
  const response = await client.post("/accounts/", account);
  return response.data;
}

export async function updateAccount(id, account) {
  const response = await client.patch(
    `/accounts/${id}`,
    account
  );
  return response.data;
}

export async function activateAccount(id) {
  const response = await client.patch(
    `/accounts/${id}/activate`
  );
  return response.data;
}

export async function deactivateAccount(id) {
  const response = await client.patch(
    `/accounts/${id}/deactivate`
  );
  return response.data;
}