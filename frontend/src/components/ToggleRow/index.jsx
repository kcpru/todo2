import React from "react";
import { useRipple } from "@hooks/useRipple.jsx";
import "./ToggleRow.scss";

/**
 * A full-width row with a label on the left and a toggle (switch) on the right.
 * The toggle can be clicked anywhere in the right area to change its value.
 * Includes a ripple effect on toggle click.
 */
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

  // Make the whole row clickable
  const handleRowClick = (e) => {
    if (!disabled) {
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
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          handleToggle(e);
        }
      }}
      style={{ position: "relative" }}
    >
      <RippleContainer />
      <span className="toggle-row-label">{label}</span>
      <div className={`toggle-row-switch${value ? " checked" : ""}`}>
        <span className="toggle-slider" />
      </div>
    </div>
  );
}
