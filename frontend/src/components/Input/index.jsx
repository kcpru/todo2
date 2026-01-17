import { useRipple } from "../../hooks/useRipple.jsx";

export function Input({
  withRipple = true,
  containerClassName = "",
  className = "",
  onMouseDown,
  isTextarea = false,
  children,
  characterLimit,
  value,
  ...props
}) {
  const mergedClassName = `search-input ${className}`.trim();
  const { createRipple, RippleContainer } = useRipple();

  const handleMouseDown = (e) => {
    if (withRipple) {
      createRipple(e);
    }
    if (onMouseDown) {
      onMouseDown(e);
    }
  };

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
      {...props}
    />
  );

  if (withRipple) {
    return (
      <div className={`input-with-ripple ${containerClassName}`.trim()}>
        <RippleContainer />
        {inputElement}
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
