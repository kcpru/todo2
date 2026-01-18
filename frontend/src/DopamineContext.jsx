import { createContext, useContext, useState } from "react";

const DopamineContext = createContext();

export function DopamineProvider({ children }) {
  const [isDopamineMode, setIsDopamineMode] = useState(() => {
    const saved = localStorage.getItem("dopamineMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [confettiCount, setConfettiCount] = useState(() => {
    const saved = localStorage.getItem("dopamine_confettiCount");
    return saved ? Number(saved) : 70;
  });

  const [animationSpeed, setAnimationSpeed] = useState(() => {
    const saved = localStorage.getItem("dopamine_animationSpeed");
    return saved ? Number(saved) : 1.0;
  });

  const toggleDopamineMode = () => {
    const newValue = !isDopamineMode;
    setIsDopamineMode(newValue);
    localStorage.setItem("dopamineMode", JSON.stringify(newValue));
  };

  const updateConfettiCount = (count) => {
    const n = Number(count) || 0;
    setConfettiCount(n);
    localStorage.setItem("dopamine_confettiCount", String(n));
  };

  const updateAnimationSpeed = (speed) => {
    const n = Number(speed) || 1;
    setAnimationSpeed(n);
    localStorage.setItem("dopamine_animationSpeed", String(n));
  };

  return (
    <DopamineContext.Provider
      value={{
        isDopamineMode,
        toggleDopamineMode,
        confettiCount,
        animationSpeed,
        updateConfettiCount,
        updateAnimationSpeed,
      }}
    >
      {children}
    </DopamineContext.Provider>
  );
}

export function useDopamine() {
  const context = useContext(DopamineContext);
  if (!context) {
    throw new Error("useDopamine must be used within DopamineProvider");
  }
  return context;
}
