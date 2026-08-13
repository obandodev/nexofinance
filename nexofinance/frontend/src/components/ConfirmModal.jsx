import { AlertTriangle } from "lucide-react";
import "./ConfirmModal.css";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  wide = false,
  danger = true,
}) {
  if (!open) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div
        className={`confirm-modal${wide ? " confirm-modal--wide" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-modal-icon">
          <AlertTriangle size={30} strokeWidth={2.2} />
        </div>

        <h2>{title}</h2>

        <div className="confirm-modal-message">{message}</div>

        <div className="confirm-modal-actions">
          <button className="confirm-btn cancel" type="button" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`confirm-btn ${danger ? "danger" : "primary"}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
