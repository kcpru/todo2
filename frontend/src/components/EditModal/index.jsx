import { motion, AnimatePresence } from "motion/react";
import { GradientButton } from "../GradientButton";
import "./EditModal.scss";

export function EditModal({
  editingId,
  editingText,
  editingDescription,
  onEditTextChange,
  onEditDescriptionChange,
  onSave,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {editingId && (
        <motion.div
          className="modal-overlay"
          onClick={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="modal-title">
              {editingId === "new" ? "NEW TASK" : "EDIT TASK"}
            </h2>
            <input
              type="text"
              className="modal-input"
              value={editingText}
              onChange={(e) => onEditTextChange(e.target.value)}
              placeholder="Task title..."
              autoFocus
            />
            <textarea
              className="modal-textarea"
              value={editingDescription}
              onChange={(e) => onEditDescriptionChange(e.target.value)}
              placeholder="Task description (optional)..."
              rows="3"
            />
            <div className="modal-buttons">
              <GradientButton
                variant="secondary"
                size="md"
                className="modal-btn cancel-btn"
                onClick={onCancel}
              >
                CANCEL
              </GradientButton>
              <GradientButton
                variant="primary"
                size="md"
                className="modal-btn apply-btn"
                onClick={onSave}
              >
                APPLY
              </GradientButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
