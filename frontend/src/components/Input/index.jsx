import { useRipple } from "../../hooks/useRipple.jsx";

export function Input({
  withRipple = false,
  containerClassName = "",
  className = "",
  onMouseDown,
  ...props
}) {
  const { createRipple, RippleContainer } = useRipple();

  const handleMouseDown = (e) => {
    if (withRipple) {
      createRipple(e);
    }
    if (onMouseDown) {
      onMouseDown(e);
    }
  };

  if (withRipple) {
    return (
      <div className={`input-with-ripple ${containerClassName}`.trim()}>
        <input className={className} onMouseDown={handleMouseDown} {...props} />
        <RippleContainer />
      </div>
    );
  }

  return (
    <input className={className} onMouseDown={handleMouseDown} {...props} />
  );
}
