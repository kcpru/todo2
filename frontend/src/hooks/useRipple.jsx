import { useRef } from "react";

export function useRipple() {
  const isAnimatingRef = useRef(false);
  const RIPPLE_DURATION_MS = 800; // Must match CSS animation duration

  const createRipple = (event) => {
    // Prevent creating a new ripple while the previous one is animating
    if (isAnimatingRef.current) {
      return;
    }

    const inputEl = event.currentTarget;
    const container =
      inputEl.closest(".input-with-ripple") || inputEl.parentElement;
    if (!container) return;

    isAnimatingRef.current = true;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Set CSS variables for ripple position
    container.style.setProperty("--ripple-x", `${x}px`);
    container.style.setProperty("--ripple-y", `${y}px`);
    // Trigger ripple via class; CSS handles animation
    container.classList.remove("ripple-active"); // reset if lingering
    // Force reflow to restart animation if needed

    container.offsetHeight;
    container.classList.add("ripple-active");

    setTimeout(() => {
      container.classList.remove("ripple-active");
      isAnimatingRef.current = false;
    }, RIPPLE_DURATION_MS);
  };

  const RippleContainer = () => null;

  return { createRipple, RippleContainer };
}
