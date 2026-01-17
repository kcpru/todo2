import { AnimatePresence, motion } from "motion/react";

export function ModalBase({
  isOpen,
  onClose,
  children,
  size = "md", // sm, md, lg
  overlayClassName = "",
  panelClassName = "",
  overlayTransition = { duration: 0.2 },
  panelTransition = { duration: 0.2 },
  overlayInitial = { opacity: 0 },
  overlayAnimate = { opacity: 1 },
  overlayExit = { opacity: 0 },
  panelInitial = { opacity: 0, scale: 0.95, y: 10 },
  panelAnimate = { opacity: 1, scale: 1, y: 0 },
  panelExit = { opacity: 0, scale: 0.95, y: 10 },
}) {
  const sizeClass = `modal-${size}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`modal-overlay ${overlayClassName}`}
          initial={overlayInitial}
          animate={overlayAnimate}
          exit={overlayExit}
          transition={overlayTransition}
          onClick={onClose}
        >
          <motion.div
            className={`modal ${sizeClass} ${panelClassName}`}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={panelTransition}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
