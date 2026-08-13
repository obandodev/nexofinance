import client from "../../../core/api/client";

export async function getTransfers() {
  const response = await client.get("/transfers/");
  return response.data;
}

export async function createTransfer(transfer) {
  const response = await client.post("/transfers/", transfer);
  return response.data;
}