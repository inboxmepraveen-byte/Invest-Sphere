import "./SliderField.css";

export default function SliderField({ label, value, onChange, min, max, step = 1, suffix = "", format }) {
  const display = format ? format(value) : `${value}${suffix}`;
  return (
    <div className="slider-field">
      <div className="slider-field-head">
        <span>{label}</span>
        <span className="slider-field-value mono">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <input
        type="number"
        className="slider-field-number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
