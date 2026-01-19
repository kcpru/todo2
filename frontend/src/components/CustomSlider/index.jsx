import React from "react";
import "./CustomSlider.scss";

export function CustomSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  className = "",
  ...props
}) {
  return (
    <div className={`custom-slider-container ${className}`}>
      {label && <label className="custom-slider-label">{label}</label>}
      <div className="custom-slider-track-wrap">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="custom-slider"
          {...props}
        />
      </div>
    </div>
  );
}

export default CustomSlider;
