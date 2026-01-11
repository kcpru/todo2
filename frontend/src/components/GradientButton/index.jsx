import { motion } from "motion/react";
import { useRipple } from "../../hooks/useRipple.jsx";
import "./GradientButton.scss";

export function GradientButton({
  children,
  icon,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  iconOnly = false,
  type = "button",
  disabled = false,
  title,
  ...props
}) {
  const { createRipple, RippleContainer } = useRipple();
  const sizeClass = iconOnly
    ? `gradient-button-icon-${size}`
    : `gradient-button-${size}`;

  const handleClick = (e) => {
    createRipple(e);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      className={`gradient-button gradient-button-${variant} ${sizeClass} ${className}`}
      onClick={handleClick}
      type={type}
      disabled={disabled}
      title={title}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {icon}
      {children}
      <RippleContainer />
    </motion.button>
  );
}
