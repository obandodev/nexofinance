import client from "../../../core/api/client";

export async function signup(email, fullName, password) {
  const response = await client.post("/auth/signup", {
    email,
    full_name: fullName,
    password,
  });

  return response.data;
}

export async function login(email, password) {
  const response = await client.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function recoverPassword(
  email,
  recoveryCode,
  newPassword,
) {
  const response = await client.post(
    "/auth/recover-password",
    {
      email,
      recovery_code: recoveryCode,
      new_password: newPassword,
    }
  );

  return response.data;
}