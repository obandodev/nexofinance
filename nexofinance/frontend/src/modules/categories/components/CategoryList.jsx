import CategoryTag from "./CategoryTag";

export default function CategoryList({ categories, onEdit, onDelete }) {
  return (
    <div className="filters-bar">
      {categories.map((c) => (
        <CategoryTag key={c.id} category={c} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
