import { useEffect, useState } from "react";
import "../styles/RecoveryCodeModal.css";
import { KeyRound } from "lucide-react";

export default function RecoveryCodeModal({
  open,
  code,
  onContinue,
}) {
  const [accepted, setAccepted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setAccepted(false);
      setCopied(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  function handleDownload() {
    const contenido = `NEXOFINANCE

CÓDIGO DE RECUPERACIÓN

${code}

Guárdalo en un lugar seguro.

Si olvidas tu contraseña y también pierdes este código,
NO podremos recuperar tu cuenta.`;

    const blob = new Blob([contenido], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Codigo-Recuperacion-NexoFinance.txt";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="recovery-overlay">
      <div className="recovery-modal">
        <div className="recovery-icon">
          <KeyRound size={28} />
        </div>

        <h2>
          Guardá tu código de recuperación
        </h2>

        <p>
          Este código solo se mostrará una vez.
        </p>

        <p className="recovery-warning">
          Si pierdes este código y olvidas tu
          contraseña, no podremos recuperar tu
          cuenta.
        </p>

        <div className="recovery-code">
          {code}
        </div>

        <button
          type="button"
          className="copy-btn"
          onClick={handleCopy}
        >
          {copied
            ? "Código copiado"
            : "Copiar código"}
        </button>

        <button
          type="button"
          className="copy-btn"
          onClick={handleDownload}
        >
          Descargar código
        </button>

        <div className="recovery-check">
          <input
            id="confirmRecovery"
            type="checkbox"
            checked={accepted}
            onChange={(e) =>
              setAccepted(e.target.checked)
            }
          />

          <label htmlFor="confirmRecovery">
            Confirmo que guardé este código en
            un lugar seguro.
          </label>
        </div>

        <button
          type="button"
          className="continue-btn"
          disabled={!accepted}
          onClick={onContinue}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
