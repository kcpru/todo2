import { useEffect } from "react";

export function useClickOutside(ref, handler, options = {}) {
  const {
    ignoreSelf = true,
    ignoreRefs = [],
    ignoreSelector,
    eventType = "mousedown",
  } = options;

  useEffect(() => {
    function handleClick(e) {
      const target = e.target;
      if (!target) return;

      if (ignoreSelf && ref.current && ref.current.contains(target)) {
        return;
      }

      if (
        ignoreSelector &&
        typeof target.closest === "function" &&
        target.closest(ignoreSelector)
      ) {
        return;
      }

      if (
        ignoreRefs.some((ignoredRef) => ignoredRef?.current?.contains?.(target))
      ) {
        return;
      }

      handler(e);
    }

    document.addEventListener(eventType, handleClick);
    return () => document.removeEventListener(eventType, handleClick);
  }, [ref, handler, ignoreSelf, ignoreRefs, ignoreSelector, eventType]);
}
