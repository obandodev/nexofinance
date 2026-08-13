import client from "../../../core/api/client";

export async function getCategories() {
  const response = await client.get("/categories/");
  return response.data;
}

export async function createCategory(category) {
  const response = await client.post("/categories/", category);
  return response.data;
}

export async function deleteCategory(id) {
  await client.delete(`/categories/${id}`);
}