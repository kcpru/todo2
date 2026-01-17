import { MdAddTask, MdEditNote } from "react-icons/md";
import { Input } from "../Input";
import { ModalForm } from "../ModalForm";
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
  const isNew = editingId === "new";
  const title = isNew ? "New task" : "Edit task";
  const icon = isNew ? <MdAddTask /> : <MdEditNote />;

  return (
    <ModalForm
      isOpen={Boolean(editingId)}
      onClose={onCancel}
      title={title}
      titleIcon={icon}
      onSave={onSave}
      onCancel={onCancel}
      saveLabel="Apply"
    >
      <Input
        type="text"
        className="modal-input"
        value={editingText}
        onChange={(e) => onEditTextChange(e.target.value)}
        placeholder="Task title..."
        autoFocus
      />
      <Input
        isTextarea={true}
        className="modal-textarea"
        value={editingDescription}
        onChange={(e) => onEditDescriptionChange(e.target.value)}
        placeholder="Task description (optional)..."
      />
    </ModalForm>
  );
}
