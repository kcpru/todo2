import { ModalBase } from "../ModalBase";
import { GradientButton } from "../GradientButton";
import "./ModalForm.scss";

export function ModalForm({
  isOpen,
  onClose,
  title,
  titleIcon,
  children,
  onSave,
  onCancel,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  isSaveDisabled = false,
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
        {titleIcon && <span className="modal-icon">{titleIcon}</span>}
        {title}
      </h2>
      <div className="modal-content">{children}</div>
      <div className="modal-buttons">
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
    </ModalBase>
  );
}
