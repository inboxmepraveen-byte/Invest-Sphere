import "./FilterBar.css";

export default function FilterBar({ children }) {
  return <div className="filter-bar">{children}</div>;
}

export function CategoryPills({ options, value, onChange }) {
  return (
    <div className="pill-group">
      {options.map((opt) => (
        <button
          key={opt}
          className={opt === value ? "pill active" : "pill"}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <label className="select-field">
      {label && <span>{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
