import { useState } from "react";
import { Wallet } from "lucide-react";
import Modal from "../../../components/Modal";
import { formatCurrency } from "../utils/formatCurrency";

export default function ContributionModal({ open, goal, accounts, onConfirm, onCancel }) {
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState("");
  const remaining = Math.max((goal?.target_amount || 0) - (goal?.current_amount || 0), 0);
  const account = accounts.find((item) => item.id === Number(accountId));

  async function handleConfirm() {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return setError("Ingresa un monto válido.");
    if (!accountId) return setError("Selecciona la cuenta desde la que quieres ahorrar.");
    if (numericAmount > remaining) return setError(`Solo puedes aportar hasta ${formatCurrency(remaining)}.`);
    if (account && numericAmount > account.balance) return setError("El monto supera el saldo disponible de la cuenta.");
    try {
      await onConfirm({ account_id: Number(accountId), amount: numericAmount, contribution_date: new Date().toISOString().slice(0, 10) });
      setAmount(""); setAccountId(""); setError("");
    } catch (requestError) { setError(requestError?.message || "No se pudo realizar el aporte."); }
  }

  function handleCancel() { setAmount(""); setAccountId(""); setError(""); onCancel(); }

  return <Modal open={open} wide title="Agregar ahorro" onClose={handleCancel} actions={<><button className="confirm-btn cancel" type="button" onClick={handleCancel}>Cancelar</button><button className="confirm-btn primary" type="button" onClick={handleConfirm}>Agregar ahorro</button></>}>
    <div className="savings-modal__body">
      <div className="savings-modal__summary">
        <div className="savings-modal__summary-item"><span className="savings-modal__label">Meta</span><strong className="savings-modal__value">{goal?.name}</strong></div>
        <div className="savings-modal__summary-item"><span className="savings-modal__label">Disponible para completar</span><strong className="savings-modal__value">{formatCurrency(remaining)}</strong></div>
      </div>
      <div className="savings-modal__field"><label htmlFor="contribution-amount">Monto a ahorrar</label><input id="contribution-amount" type="number" min="1" max={remaining} value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Ej. 200000" /></div>
      <div className="savings-modal__field"><label htmlFor="contribution-account">Cuenta de origen</label><select id="contribution-account" value={accountId} onChange={(event) => setAccountId(event.target.value)}><option value="">Selecciona una cuenta</option>{accounts.map((item) => <option key={item.id} value={item.id}>{item.name} · {formatCurrency(item.balance)} disponibles</option>)}</select></div>
      {account && <p className="savings-modal__info"><Wallet size={15} /> Saldo después del aporte: {formatCurrency(account.balance - Number(amount || 0))}</p>}
      {error && <p className="savings-modal__error">{error}</p>}
    </div>
  </Modal>;
}
