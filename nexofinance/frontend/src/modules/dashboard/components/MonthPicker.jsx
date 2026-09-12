import { CalendarDays } from "lucide-react";

export default function MonthPicker({ month, max, onChange }) {
  return (
    <label className="dashboard__month-picker">
      <CalendarDays size={16} className="dashboard__month-icon" />
      <input type="month" value={month} max={max} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
