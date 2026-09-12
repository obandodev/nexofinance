export default function CategoryTag({ category, onEdit, onDelete }) {
  const isSystem = category.user_id === null;

  return (
    <span
      className={`tag category-tag ${
        category.category_type === "income" ? "tag--income" : "tag--expense"
      }`}
    >
      {category.name} {isSystem && "· sistema"}

      {!isSystem && (
        <>
          <button className="category-tag__action" onClick={() => onEdit(category)}>
            editar
          </button>
          <button className="category-tag__action" onClick={() => onDelete(category)}>
            ×
          </button>
        </>
      )}
    </span>
  );
}
