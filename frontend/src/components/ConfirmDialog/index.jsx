import { Button } from "../Button";
import { ModalBase } from "../ModalBase";
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
    <ModalBase
      isOpen={isOpen}
      onClose={onCancel}
      overlayClassName="confirm-overlay"
      panelClassName="confirm-modal"
      overlayTransition={{ duration: 0.15 }}
      panelTransition={{ duration: 0.15 }}
      panelInitial={{ opacity: 0, scale: 0.95, y: 8 }}
      panelAnimate={{ opacity: 1, scale: 1, y: 0 }}
      panelExit={{ opacity: 0, scale: 0.95, y: 8 }}
    >
      <div className="confirm-title">{title}</div>
      {message && <div className="confirm-message">{message}</div>}
      <div className="confirm-buttons">
        <Button
          variant="secondary"
          size="md"
          className="confirm-btn cancel-btn"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          size="md"
          className="confirm-btn apply-btn"
          onClick={onConfirm}
          title={confirmText}
        >
          {confirmText}
        </Button>
      </div>
    </ModalBase>
  );
}
