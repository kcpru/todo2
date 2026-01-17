import { createContext, useContext, useState } from "react";

const DopamineContext = createContext();

export function DopamineProvider({ children }) {
  const [isDopamineMode, setIsDopamineMode] = useState(() => {
    const saved = localStorage.getItem("dopamineMode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDopamineMode = () => {
    const newValue = !isDopamineMode;
    setIsDopamineMode(newValue);
    localStorage.setItem("dopamineMode", JSON.stringify(newValue));
  };

  return (
    <DopamineContext.Provider
      value={{
        isDopamineMode,
        toggleDopamineMode,
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
