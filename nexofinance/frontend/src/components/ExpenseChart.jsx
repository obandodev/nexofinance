import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "./ExpenseChart.css";

const COLORS = ["#00D9A3", "#F5A623", "#5B8CFF", "#FF5C5C", "#B794F6", "#4FD1C5"];

export default function ExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="expense-chart__empty">Todavía no hay gastos registrados este mes.</p>;
  }

  return (
    <div className="expense-chart">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="category_name" innerRadius={70} outerRadius={100} paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#141924", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
            labelStyle={{ color: "#EDEFF3" }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="expense-chart__legend">
        {data.map((item, i) => (
          <div className="expense-chart__legend-item" key={item.category_name}>
            <span className="expense-chart__dot" style={{ background: COLORS[i % COLORS.length] }} />
            <span>{item.category_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
