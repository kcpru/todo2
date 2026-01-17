import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdMoreVert } from "react-icons/md";
import { AnimatePresence, motion } from "motion/react";
import { GradientButton } from "../GradientButton";
import "./ActionMenu.scss";

export function ActionMenu({ items = [], size = "sm", className = "" }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.right,
        width: rect.width,
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const inTrigger = wrapperRef.current?.contains(event.target);
      const inDropdown = dropdownRef.current?.contains(event.target);
      if (!inTrigger && !inDropdown) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const menuWidth = 160;

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="action-menu__dropdown"
          ref={dropdownRef}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left - menuWidth,
            minWidth: menuWidth,
          }}
        >
          {items.map((item, idx) => (
            <GradientButton
              key={idx}
              size="sm"
              iconOnly={false}
              variant={item.variant || "secondary"}
              className="action-menu__item-btn"
              onClick={(e) => {
                e.stopPropagation();
                item.onClick?.();
                setOpen(false);
              }}
              icon={<span className="action-menu__icon">{item.icon}</span>}
            >
              <span className="action-menu__label">{item.label}</span>
            </GradientButton>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className={`action-menu ${className}`}
      ref={wrapperRef}
      onClick={(e) => e.stopPropagation()}
    >
      <GradientButton
        ref={triggerRef}
        size={size}
        iconOnly
        variant="secondary"
        className="action-menu__trigger"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        icon={<MdMoreVert />}
        title="More options"
      />

      {createPortal(dropdown, document.body)}
    </div>
  );
}
