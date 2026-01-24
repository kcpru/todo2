import { useState } from "react";
import { MdShare } from "react-icons/md";

import { Input } from "@components/Input";
import { ModalForm } from "@components/ModalForm";
import { TodoListPreview } from "@components/TodoListPreview";
import "./SharePostModal.scss";

export function SharePostModal({
  isOpen,
  onClose,
  todoListName,
  completedCount,
  totalCount,
  onShare,
  isLoading = false,
}) {
  const [content, setContent] = useState("");

  const handleShare = async () => {
    await onShare(content);
    setContent("");
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Achievement"
      titleIcon={<MdShare />}
      onSave={handleShare}
      onCancel={onClose}
      saveLabel="Share Post"
      cancelLabel="Cancel"
      isSaveDisabled={isLoading}
      size="md"
    >
      <TodoListPreview
        todoListJson={JSON.stringify({
          name: todoListName,
          items: Array(totalCount)
            .fill(null)
            .map((_, i) => ({ isCompleted: i < completedCount })),
        })}
      />

      <Input
        isTextarea={true}
        className="modal-textarea share-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a caption (optional)..."
        characterLimit={500}
        disabled={isLoading}
      />
    </ModalForm>
  );
}
