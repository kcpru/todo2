import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import { useRipple } from "@hooks/useRipple.jsx";

export function Input({
  withRipple = true,
  containerClassName = "",
  className = "",
  onMouseDown,
  isTextarea = false,
  children,
  characterLimit,
  value,
  type,
  ...props
}) {
  const mergedClassName = `search-input ${className}`.trim();
  const { createRipple, RippleContainer } = useRipple();

  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDown = (e) => {
    if (withRipple) {
      createRipple(e);
    }
    if (onMouseDown) {
      onMouseDown(e);
    }
  };

  let inputType = type;
  if (type === "password") {
    inputType = showPassword ? "text" : "password";
  }

  const inputElement = isTextarea ? (
    <textarea
      className={mergedClassName}
      onMouseDown={handleMouseDown}
      value={value}
      {...props}
    />
  ) : (
    <input
      className={mergedClassName}
      onMouseDown={handleMouseDown}
      value={value}
      type={inputType}
      {...props}
    />
  );

  const showPasswordIcon = type === "password" && !isTextarea;

  if (withRipple) {
    return (
      <div className={`input-with-ripple ${containerClassName}`.trim()}>
        <RippleContainer />
        {inputElement}
        {showPasswordIcon && (
          <button
            type="button"
            className="password-toggle-btn"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <MdVisibilityOff size={22} />
            ) : (
              <MdVisibility size={22} />
            )}
          </button>
        )}
        {characterLimit && value && (
          <div className="character-counter">
            {value.length}/{characterLimit}
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <>
      {inputElement}
      {characterLimit && value && (
        <div className="character-counter">
          {value.length}/{characterLimit}
        </div>
      )}
      {children}
    </>
  );
}
