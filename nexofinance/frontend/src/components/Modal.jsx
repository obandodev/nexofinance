import { X } from "lucide-react";
import "./Modal.css";

export default function Modal({ open, title, children, actions, wide = false, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal${wide ? " modal--wide" : ""}`} onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button className="modal__close" type="button" onClick={onClose} aria-label="Cerrar"><X size={19} /></button>
        </div>
        <div className="modal__content">{children}</div>
        {actions && <div className="modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
