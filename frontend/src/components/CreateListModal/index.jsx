import { MdPlaylistAdd } from "react-icons/md";
import { GradientButton } from "../GradientButton";
import { Input } from "../Input";
import { ModalBase } from "../ModalBase";
import "./CreateListModal.scss";

export function CreateListModal({
  isOpen,
  listName,
  onListNameChange,
  onSave,
  onCancel,
}) {
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onCancel}
      overlayClassName="modal-overlay"
      panelClassName="modal"
      overlayTransition={{ duration: 0.2 }}
      panelTransition={{ duration: 0.2 }}
    >
      <h2 className="modal-title">
        <MdPlaylistAdd /> New list
      </h2>
      <Input
        type="text"
        className="modal-input"
        value={listName}
        onChange={(e) => onListNameChange(e.target.value)}
        placeholder="List name..."
        autoFocus
      />
      <div className="modal-buttons">
        <GradientButton variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </GradientButton>
        <GradientButton
          variant="primary"
          size="md"
          onClick={onSave}
          disabled={!listName.trim()}
        >
          Create
        </GradientButton>
      </div>
    </ModalBase>
  );
}
