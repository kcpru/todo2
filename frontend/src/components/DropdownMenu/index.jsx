import { AnimatePresence } from "motion/react";

import { ANIMATION_CONFIG } from "../../constants/animations";

export function DropdownMenu({
  isOpen,
  children,
  className = "",
  position = "bottom-right",
}) {
  const positionClass = `dropdown-${position}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`dropdown-menu ${positionClass} ${className}`.trim()}
          {...ANIMATION_CONFIG.dropdown}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
