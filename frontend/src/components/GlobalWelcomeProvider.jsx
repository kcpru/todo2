import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { WelcomeModal } from "@components/WelcomeModal";
import { TourProviderWrapper, todoTourSteps } from "@components/Tour/TourSetup";

export default function GlobalWelcomeProvider({ children }) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourSteps, setTourSteps] = useState(todoTourSteps);
  const location = useLocation();
  const autoTourShown = useRef(false);

  // Must be declared before useEffect!
  const handleShowTour = useCallback(() => {
    setShowTour(true);
    setTourSteps([...todoTourSteps]);
  }, []);

  // Always allow tour to be shown, even if welcome modal is hidden
  useEffect(() => {
    const hideWelcome = localStorage.getItem("todo2_welcome_modal_hide");
    const sessionHide = sessionStorage.getItem(
      "todo2_welcome_modal_hide_session"
    );
    setShowWelcome(!hideWelcome && !sessionHide);
    autoTourShown.current = false;
    // If a flag is set to trigger tour after navigation, do it
    if (localStorage.getItem("todo2_trigger_tour")) {
      localStorage.removeItem("todo2_trigger_tour");
      handleShowTour();
    }
    // eslint-disable-next-line
  }, [location.pathname, handleShowTour]);

  return (
    <TourProviderWrapper steps={tourSteps}>
      {children}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => {
          sessionStorage.setItem("todo2_welcome_modal_hide_session", "1");
          setShowWelcome(false);
        }}
        onShowTour={() => {
          localStorage.setItem("todo2_trigger_tour", "1");
          sessionStorage.setItem("todo2_welcome_modal_hide_session", "1");
          setShowWelcome(false);
        }}
      />
    </TourProviderWrapper>
  );
}
