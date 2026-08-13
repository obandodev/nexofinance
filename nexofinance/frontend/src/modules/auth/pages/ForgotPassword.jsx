import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recoverPassword } from "../api/auth";
import "../styles/Auth.css";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const data = await recoverPassword(
        email,
        recoveryCode,
        newPassword
      );

      setSuccess(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "No se pudo recuperar la contraseña."
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
          Recuperar contraseña
        </p>

        <label className="auth__label">
          Correo electrónico
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
          Código de recuperación
        </label>

        <input
          className="auth__input"
          value={recoveryCode}
          onChange={(e) =>
            setRecoveryCode(e.target.value.toUpperCase())
          }
          placeholder="NEXO-XXXX-XXXX-XXXX"
          required
        />

        <label className="auth__label">
          Nueva contraseña
        </label>

        <div className="auth__password-wrap">
          <input
            className="auth__input"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            required
            minLength={6}
          />

          <button
            type="button"
            className="auth__eye"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>

        {error && (
          <p className="auth__error">
            {error}
          </p>
        )}

        {success && (
          <p
            style={{
              color: "#37d67a",
              marginBottom: 15,
            }}
          >
            {success}
          </p>
        )}

        <button
          className="auth__submit"
          type="submit"
        >
          Cambiar contraseña
        </button>

        <p className="auth__switch">
          <Link to="/login">
            Volver al inicio de sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
