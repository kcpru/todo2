import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";

import { ANIMATION_CONFIG } from "@constants/animations";

export function DropdownMenu({ isOpen, children, className = "" }) {
  const menu = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`dropdown-menu ${className}`.trim()}
          {...ANIMATION_CONFIG.dropdown}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(menu, document.body);
}
