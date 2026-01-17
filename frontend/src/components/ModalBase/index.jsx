import { AnimatePresence, motion } from "motion/react";

export function ModalBase({
  isOpen,
  onClose,
  children,
  size = "md", // sm, md, lg
  overlayClassName = "",
  panelClassName = "",
  overlayTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  panelTransition = {
    type: "spring",
    stiffness: 200,
    damping: 20,
    mass: 1,
    restDelta: 0.001,
  },
  overlayInitial = { opacity: 0 },
  overlayAnimate = { opacity: 1 },
  overlayExit = { opacity: 0 },
  panelInitial = {},
  panelAnimate = {},
  panelExit = {},
  layoutId,
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
            layoutId={layoutId}
            layout
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={panelTransition}
            style={{ opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
