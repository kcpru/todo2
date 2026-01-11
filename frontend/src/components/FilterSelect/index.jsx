import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MdExpandMore } from "react-icons/md";
import { useRipple } from "../../hooks/useRipple";
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
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
