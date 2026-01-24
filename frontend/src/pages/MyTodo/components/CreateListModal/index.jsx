import { MdPlaylistAdd } from "react-icons/md";

import { Input } from "@components/Input";
import { ModalForm } from "@components/ModalForm";
import "./CreateListModal.scss";

export function CreateListModal({
  isOpen,
  listName,
  onListNameChange,
  onSave,
  onCancel,
}) {
  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onCancel}
      title="New list"
      titleIcon={<MdPlaylistAdd />}
      onSave={onSave}
      onCancel={onCancel}
      saveLabel="Create"
      isSaveDisabled={!listName.trim()}
    >
      <Input
        type="text"
        className="modal-input"
        value={listName}
        onChange={(e) => onListNameChange(e.target.value)}
        placeholder="List name..."
        autoFocus
      />
    </ModalForm>
  );
}
