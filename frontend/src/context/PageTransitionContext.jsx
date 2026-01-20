import { createContext, useContext, useRef } from "react";

const PageTransitionContext = createContext();

export function PageTransitionProvider({ children }) {
  // lastTabIndexRef is a ref so it persists between renders but doesn't cause rerender
  const lastTabIndexRef = useRef(null);
  const directionRef = useRef("up"); // default direction

  const setTransition = (fromIdx, toIdx) => {
    if (fromIdx === null) {
      directionRef.current = "up";
    } else if (toIdx > fromIdx) {
      directionRef.current = "down";
    } else if (toIdx < fromIdx) {
      directionRef.current = "up";
    } else {
      directionRef.current = "up";
    }
    lastTabIndexRef.current = toIdx;
  };

  return (
    <PageTransitionContext.Provider value={{
      lastTabIndexRef,
      directionRef,
      setTransition
    }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(PageTransitionContext);
}
