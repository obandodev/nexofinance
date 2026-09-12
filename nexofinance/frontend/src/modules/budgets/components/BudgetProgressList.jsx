import BudgetProgressRow from "./BudgetProgressRow";

export default function BudgetProgressList({ progress, canEdit, onSave, onDelete }) {
  if (progress.length === 0) {
    return <p className="budgets__empty">No hay presupuestos definidos para este mes.</p>;
  }

  return (
    <>
      {progress.map((p) => (
        <BudgetProgressRow
          key={p.id}
          item={p}
          canEdit={canEdit}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
