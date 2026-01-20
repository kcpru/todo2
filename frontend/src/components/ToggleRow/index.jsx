import { useRipple } from "@hooks/useRipple.jsx";
import "./ToggleRow.scss";

export default function ToggleRow({
  label,
  value,
  onChange,
  className = "",
  disabled = false,
}) {
  const { createRipple, RippleContainer } = useRipple();

  const handleToggle = (e) => {
    if (!disabled) {
      createRipple(e);
      onChange(!value);
    }
  };

  const handleRowClick = (e) => {
    if (!disabled) {
      handleToggle(e);
    }
  };

  const onKeyDown = (e) => {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      handleToggle(e);
    }
  };

  return (
    <div
      className={`toggle-row input-with-ripple ${className} ${disabled ? "disabled" : ""}`.trim()}
      onClick={handleRowClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={value}
      onKeyDown={onKeyDown}
    >
      <RippleContainer />
      <span className="toggle-row-label">{label}</span>
      <div className={`toggle-row-switch${value ? " checked" : ""}`}>
        <span className="toggle-slider" />
      </div>
    </div>
  );
}
