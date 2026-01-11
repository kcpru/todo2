import { GradientButton } from "../GradientButton";
import { MdAddTask, MdEditNote } from "react-icons/md";
import { Input } from "../Input";
import { ModalBase } from "../ModalBase";
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
    <ModalBase
      isOpen={Boolean(editingId)}
      onClose={onCancel}
      overlayClassName="modal-overlay"
      panelClassName="modal"
      overlayTransition={{ duration: 0.2 }}
      panelTransition={{ duration: 0.2 }}
    >
      <h2 className="modal-title">
        {editingId === "new" ? (
          <>
            <MdAddTask /> New task
          </>
        ) : (
          <>
            <MdEditNote /> Edit task
          </>
        )}
      </h2>
      <Input
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
        <GradientButton variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </GradientButton>
        <GradientButton variant="primary" size="md" onClick={onSave}>
          Apply
        </GradientButton>
      </div>
    </ModalBase>
  );
}
