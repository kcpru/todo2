import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModalForm } from "@components/ModalForm";
import { Button } from "@components/Button";
import ToggleRow from "@components/ToggleRow";
import "./WelcomeModal.scss";

export function WelcomeModal({ isOpen, onClose, onShowTour }) {
  const navigate = useNavigate();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem("todo2_welcome_modal_hide", "1");
    }
    onClose();
  };

  const handleShowTour = () => {
    if (dontShowAgain) {
      localStorage.setItem("todo2_welcome_modal_hide", "1");
    }
    onShowTour();
    onClose();
    setTimeout(() => {
      navigate("/todo");
    }, 10);
  };

  useEffect(() => {
    if (isOpen) setDontShowAgain(false);
  }, [isOpen]);

  return (
    <ModalForm
      isOpen={isOpen}
      onCancel={handleSkip}
      onSave={handleShowTour}
      saveLabel="Show Tour"
      cancelLabel="Skip"
      title="👋 Welcome to Todo2"
      showFooter={true}
      showCloseButton={true}
    >
      <p className="welcome-modal-intro">
        We're excited to help you organize your day and boost your productivity.
        <br />
        <br />
        <b>Todo2</b> is more than just a todo list – it's your personal space
        to:
      </p>
      <ul className="welcome-modal-list">
        <li>✔️ Capture and manage all your tasks</li>
        <li>🎯 Stay focused with motivational messages</li>
        <li>📊 Track your progress and celebrate achievements</li>
        <li>🤝 Share lists and collaborate with others</li>
      </ul>
      <p className="welcome-modal-tour-invite">
        Would you like a quick, interactive tour to get started and discover all
        the features?
      </p>
      <ToggleRow
        label="Don’t show this again"
        value={dontShowAgain}
        onChange={setDontShowAgain}
      />
    </ModalForm>
  );
}
