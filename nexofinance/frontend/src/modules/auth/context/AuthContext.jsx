import { createContext, useContext, useState } from "react";
import {
  login as loginRequest,
  signup as signupRequest,
} from "./../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  function persistSession(data) {
    localStorage.setItem(
      "token",
      data.access_token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setUser(data.user);
  }

  async function login(
    email,
    password
  ) {
    const data = await loginRequest(
      email,
      password
    );

    persistSession(data);

    return data;
  }

  async function signup(
    email,
    fullName,
    password
  ) {
    const data = await signupRequest(
      email,
      fullName,
      password
    );

    persistSession(data);

    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}