import client from "../../../core/api/client";

export async function getSavingsGoals() {
  const response = await client.get("/savings-goals/");
  return response.data;
}

export async function createSavingsGoal(goal) {
  const response = await client.post("/savings-goals/", goal);
  return response.data;
}

export async function updateSavingsGoal(id, changes) {
  const response = await client.patch(
    `/savings-goals/${id}`,
    changes
  );
  return response.data;
}

export async function cancelSavingsGoal(id) {
  const response = await client.post(
    `/savings-goals/${id}/cancel`
  );
  return response.data;
}

export async function addSavingsContribution(goalId, data) {
  const response = await client.post(
    `/savings-goals/${goalId}/contributions`,
    data
  );
  return response.data;
}

export async function getSavingsContributions(goalId) {
  const response = await client.get(
    `/savings-goals/${goalId}/contributions`
  );
  return response.data;
}

export async function updateSavingsContribution(id, changes) {
  const response = await client.patch(
    `/savings-goals/contributions/${id}`,
    changes
  );
  return response.data;
}

export async function cancelSavingsContribution(id) {
  const response = await client.post(
    `/savings-goals/contributions/${id}/cancel`
  );
  return response.data;
}