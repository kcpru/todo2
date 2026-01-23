import { MdClose } from "react-icons/md";
import { ModalBase } from "../ModalBase";
import { Button } from "../Button";
import "./ModalForm.scss";

export function ModalForm({
  isOpen,
  size = "md",
  title,
  titleIcon,
  children,
  onSave,
  onCancel,
  onClose,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  isSaveDisabled = false,
  showFooter = true,
  showCloseButton = false,
  layoutId,
}) {
  const handleClose = onClose || onCancel;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={handleClose}
      size={size}
      layoutId={layoutId}
    >
      {title && (
        <div className="modal-header">
          <h2 className="modal-title">
            {titleIcon && <span className="modal-icon">{titleIcon}</span>}
            {title}
          </h2>
          {showCloseButton && (
            <button
              className="modal-close-btn"
              onClick={handleClose}
              aria-label="Close"
            >
              <MdClose />
            </button>
          )}
        </div>
      )}

      <div className="modal-body">{children}</div>

      {showFooter && (
        <div className="modal-footer">
          <Button variant="secondary" size="md" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onSave}
            disabled={isSaveDisabled}
          >
            {saveLabel}
          </Button>
        </div>
      )}
    </ModalBase>
  );
}
