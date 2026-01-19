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
    return saved === "fast" || saved === "slow" ? saved : "fast";
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

  const updateAnimationSpeed = (mode) => {
    const value = mode === "slow" ? "slow" : "fast";
    setAnimationSpeed(value);
    localStorage.setItem("dopamine_animationSpeed", value);
  };

  const [videoEnabled, setVideoEnabled] = useState(() => {
    const saved = localStorage.getItem("dopamine_videoEnabled");
    return saved ? JSON.parse(saved) : true;
  });
  const [videoSize, setVideoSize] = useState(() => {
    const saved = localStorage.getItem("dopamine_videoSize");
    if (saved === "large" || saved === "medium" || saved === "small")
      return saved;
    return "small";
  });

  const toggleVideoEnabled = () => {
    const newValue = !videoEnabled;
    setVideoEnabled(newValue);
    localStorage.setItem("dopamine_videoEnabled", JSON.stringify(newValue));
  };
  const updateVideoSize = (size) => {
    let value = "small";
    if (size === "large" || size === "medium") value = size;
    setVideoSize(value);
    localStorage.setItem("dopamine_videoSize", value);
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
        videoEnabled,
        toggleVideoEnabled,
        videoSize,
        updateVideoSize,
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
