import { useEffect } from "react";

/**
 * Locks document body scroll when enabled.
 * - Adds overflow: hidden to body
 * - Adds right padding equal to scrollbar width to avoid layout shift
 */
export function useScrollLock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const body = document.body;
    const docEl = document.documentElement;

    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // Calculate scrollbar width to prevent content shift
    const scrollbarWidth = window.innerWidth - docEl.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow || "";
      body.style.paddingRight = prevPaddingRight || "";
    };
  }, [enabled]);
}
