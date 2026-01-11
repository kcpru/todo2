import { AnimatePresence, motion } from "motion/react";
import { GradientButton } from "../GradientButton";
import "./ConfirmDialog.scss";

export function ConfirmDialog({
  isOpen,
  title = "Confirm",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmVariant = "danger",
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCancel}
        >
          <motion.div
            className="confirm-modal"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-title">{title}</div>
            {message && <div className="confirm-message">{message}</div>}
            <div className="confirm-buttons">
              <GradientButton
                variant="secondary"
                size="md"
                className="confirm-btn cancel-btn"
                onClick={onCancel}
              >
                {cancelText}
              </GradientButton>
              <GradientButton
                variant={confirmVariant}
                size="md"
                className="confirm-btn apply-btn"
                onClick={onConfirm}
                title={confirmText}
              >
                {confirmText}
              </GradientButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
