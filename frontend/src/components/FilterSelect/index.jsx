import { motion, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { MdExpandMore } from "react-icons/md";

import { ANIMATION_CONFIG } from "@constants/animations";
import { useClickOutside } from "@hooks/useClickOutside";
import { useRipple } from "@hooks/useRipple";

import "./FilterSelect.scss";

export function FilterSelect({
  options,
  value,
  onChange,
  ariaLabel = "Filter",
  size = "md",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { createRipple, RippleContainer } = useRipple();

  useClickOutside(ref, () => setOpen(false));

  const current = options.find((o) => o.value === value) || options[0];

  const handleButtonClick = (e) => {
    createRipple(e);
    setOpen((v) => !v);
  };

  return (
    <div className="filter-select" ref={ref}>
      <button
        type="button"
        className={`filter-select__button input-with-ripple filter-select__button--${size}`}
        aria-label={ariaLabel}
        onClick={handleButtonClick}
      >
        <span className="filter-select__label">
          {current?.icon}
          {current?.label}
        </span>
        <span className="filter-select__chevron">
          <MdExpandMore
            style={{
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s ease",
            }}
          />
        </span>
        <RippleContainer />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="filter-select__menu"
            initial={ANIMATION_CONFIG.dropdown.initial}
            animate={ANIMATION_CONFIG.dropdown.animate}
            exit={ANIMATION_CONFIG.dropdown.exit}
            transition={ANIMATION_CONFIG.dropdown.transition}
          >
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <div
                  key={option.value}
                  className={`filter-select__item ${
                    isActive ? "is-active" : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
