import client from "../../../core/api/client";

export async function getProfile() {
  const response = await client.get("/auth/me");
  return response.data;
}

export async function updateProfile(fullName) {
  const response = await client.patch("/auth/me", { full_name: fullName });
  return response.data;
}

export async function changePassword(currentPassword, newPassword) {
  const response = await client.post("/auth/me/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
}