import "./Panel.css";

export default function Panel({ title, children }) {
  return (
    <div className="panel">
      {title && <h2 className="panel__title">{title}</h2>}
      {children}
    </div>
  );
}
