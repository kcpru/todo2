import { MdClose } from "react-icons/md";
import { ModalBase } from "../ModalBase";
import { GradientButton } from "../GradientButton";
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
}) {
  const handleClose = onClose || onCancel;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={handleClose}
      size={size}
      overlayTransition={{ duration: 0.2 }}
      panelTransition={{ duration: 0.2 }}
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
          <GradientButton variant="secondary" size="md" onClick={onCancel}>
            {cancelLabel}
          </GradientButton>
          <GradientButton
            variant="primary"
            size="md"
            onClick={onSave}
            disabled={isSaveDisabled}
          >
            {saveLabel}
          </GradientButton>
        </div>
      )}
    </ModalBase>
  );
}
