import { forwardRef } from "react";
import { motion } from "motion/react";
import { useRipple } from "../../hooks/useRipple.jsx";
import "./GradientButton.scss";

export const GradientButton = forwardRef(
  (
    {
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
    },
    ref
  ) => {
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
        ref={ref}
        className={`gradient-button input-with-ripple gradient-button-${variant} ${sizeClass} ${className}`}
        onClick={handleClick}
        type={type}
        disabled={disabled}
        title={title}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {(icon || children) && (
          <span className="gradient-button__content">
            {icon}
            {children}
          </span>
        )}
        <RippleContainer />
      </motion.button>
    );
  }
);

GradientButton.displayName = "GradientButton";
