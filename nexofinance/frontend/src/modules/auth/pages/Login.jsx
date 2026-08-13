import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError(
        "Correo o contraseña incorrectos"
      );
    }
  }

  return (
    <div className="auth">
      <div className="auth__glow" />
      <form
        className="auth__card"
        onSubmit={handleSubmit}
      >
        <div className="auth__brand">
          <span className="auth__brand-dot" />
          NexoFinance
        </div>
        <p className="auth__subtitle">
          Tu vida financiera, en un solo lugar
        </p>
        <label className="auth__label">
          Correo
        </label>
        <input
          className="auth__input"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <label className="auth__label">
          Contraseña
        </label>

        <input
          className="auth__input"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        {error && (
          <p className="auth__error">
            {error}
          </p>
        )}

        <button
          className="auth__submit"
          type="submit"
        >
          Ingresar
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: 18,
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        <p className="auth__switch">
          ¿No tenés cuenta?{" "}
          <Link to="/signup">
            Creá una gratis
          </Link>
        </p>
      </form>
    </div>
  );
}