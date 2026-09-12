import { PAGE_SIZE } from "../hooks/useTransactions";

export default function TransactionsPagination({ page, totalPages, total, onPrev, onNext }) {
  return (
    <div className="transactions-pagination">
      <span>
        {total === 0
          ? "0 resultados"
          : `Mostrando ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} de ${total}`}
      </span>

      <div className="transactions-pagination__controls">
        <button className="filters-bar__clear" disabled={page <= 1} onClick={onPrev}>
          Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button className="filters-bar__clear" disabled={page >= totalPages} onClick={onNext}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
