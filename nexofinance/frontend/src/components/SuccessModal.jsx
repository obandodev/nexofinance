import "./SuccessModal.css";

export default function SuccessModal({ open, title, message, onClose }) {
  if (!open) return null;

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal-icon">✓</div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="success-modal-actions">
          <button className="success-btn" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}