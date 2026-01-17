import { useRipple } from "../../hooks/useRipple.jsx";

export function Input({
  withRipple = true,
  containerClassName = "",
  className = "",
  onMouseDown,
  isTextarea = false,
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
      {...props}
    />
  ) : (
    <input
      className={mergedClassName}
      onMouseDown={handleMouseDown}
      {...props}
    />
  );

  if (withRipple) {
    return (
      <div className={`input-with-ripple ${containerClassName}`.trim()}>
        <RippleContainer />
        {inputElement}
      </div>
    );
  }

  return inputElement;
}
