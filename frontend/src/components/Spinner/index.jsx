import React from "react";
import "./Spinner.scss";

export function Spinner({ size = 48 }) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size, display: "inline-block" }}
      aria-label="Loading"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ display: "block" }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#888"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
          strokeDashoffset="0"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
  );
}
