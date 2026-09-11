import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AppLayout from "../../../components/AppLayout";
import Panel from "../../../components/Panel";
import SuccessModal from "../../../components/SuccessModal";
import { getProfile, updateProfile, changePassword } from "../api/profile";
import "../../../styles/forms.css";
import "../styles/Profile.css";

function PasswordInput({ value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        className="password-input__toggle"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState("");
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  useEffect(() => {
    getProfile().then((data) => {
      setFullName(data.full_name);
      setEmail(data.email);
    });
  }, []);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError("");

    try {
      await updateProfile(fullName);
      setShowProfileSuccess(true);
    } catch (err) {
      setProfileError(
        err.response?.data?.detail || "No se pudo actualizar el perfil."
      );
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSuccess(true);
    } catch (err) {
      setPasswordError(
        err.response?.data?.detail || "No se pudo cambiar la contraseña."
      );
    }
  }

  return (
    <AppLayout>
      <h1 className="dashboard__title">Mi perfil</h1>

      <Panel title="Datos de la cuenta">
        <form onSubmit={handleProfileSubmit}>
          <div className="form-row">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nombre completo"
              required
            />

            <input value={email} disabled title="El correo no se puede cambiar" />
          </div>

          {profileError && (
            <p style={{ color: "var(--red)", fontSize: "var(--text-sm)" }}>
              {profileError}
            </p>
          )}

          <button className="form-submit" type="submit">
            Guardar cambios
          </button>
        </form>
      </Panel>

      <Panel title="Cambiar contraseña">
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-row">
            <PasswordInput
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-row">
            <PasswordInput
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <PasswordInput
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {passwordError && (
            <p style={{ color: "var(--red)", fontSize: "var(--text-sm)" }}>
              {passwordError}
            </p>
          )}

          <button className="form-submit" type="submit">
            Cambiar contraseña
          </button>
        </form>
      </Panel>

      <SuccessModal
        open={showProfileSuccess}
        title="Perfil actualizado"
        message="Tu nombre se guardó correctamente."
        onClose={() => setShowProfileSuccess(false)}
      />

      <SuccessModal
        open={showPasswordSuccess}
        title="Contraseña actualizada"
        message="Tu contraseña se cambió correctamente."
        onClose={() => setShowPasswordSuccess(false)}
      />
    </AppLayout>
  );
}