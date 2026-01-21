import { GradientButton } from "../GradientButton";
import "./TourPopover.scss";

export function TourPopover({
  setCurrentStep,
  setIsOpen,
  currentStep,
  steps,
  ...props
}) {
  const safeSteps = Array.isArray(steps) ? steps : [];
  const stepObj = safeSteps[currentStep];
  const stepContent = stepObj?.content;

  const handleClose = () => setIsOpen(false);
  const handlePrev = () => setCurrentStep(currentStep - 1);
  const handleNext = () => setCurrentStep(currentStep + 1);

  const renderContent = () => stepContent || "No description for this step.";

  return (
    <div className="tour-popover-modal">
      <div className="tour-popover-content">{renderContent()}</div>
      <div className="tour-popover-footer">
        <GradientButton
          size="sm"
          variant="secondary"
          onClick={handleClose}
          className="tour-popover-close"
        >
          Close
        </GradientButton>
        <div className="tour-popover-controls">
          <GradientButton
            size="sm"
            variant="primary"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Previous
          </GradientButton>
          <GradientButton
            size="sm"
            variant="primary"
            onClick={handleNext}
            disabled={currentStep === safeSteps.length - 1}
          >
            Next
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
