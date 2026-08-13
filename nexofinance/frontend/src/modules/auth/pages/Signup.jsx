import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RecoveryCodeModal from "../components/RecoveryCodeModal";
import "../styles/Auth.css";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const data = await signup(
        email,
        fullName,
        password
      );

      setRecoveryCode(data.recovery_code);
      setShowRecoveryModal(true);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "No se pudo crear la cuenta"
      );
    }
  }

  function handleContinue() {
    setShowRecoveryModal(false);
    navigate("/dashboard");
  }

  return (
    <>
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
            Creá tu cuenta gratis
          </p>

          <label className="auth__label">
            Nombre completo
          </label>

          <input
            className="auth__input"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            required
          />

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

          <div className="auth__password-wrap">
            <input
              className="auth__input"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={6}
            />

            <button
              type="button"
              className="auth__eye"
              onClick={() =>
                setShowPassword((v) => !v)
              }
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <label className="auth__label">
            Confirmar contraseña
          </label>

          <div className="auth__password-wrap">
            <input
              className="auth__input"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
            />
          </div>

          {error && (
            <p className="auth__error">
              {error}
            </p>
          )}

          <button
            className="auth__submit"
            type="submit"
          >
            Crear cuenta
          </button>

          <p className="auth__switch">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>

      <RecoveryCodeModal
        open={showRecoveryModal}
        code={recoveryCode}
        onContinue={handleContinue}
      />
    </>
  );
}
