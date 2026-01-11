import { useState } from "react";
import { useTheme } from "../../ThemeContext";
import { useDopamine } from "../../DopamineContext";
import { useAuth } from "../../AuthContext";
import { useCoinsSystem } from "../../hooks/useCoinsSystem";
import { motion } from "motion/react";
import { GradientButton } from "../GradientButton";
import ProfileMenu from "./ProfileMenu";
import "./Header.scss";

export function Header() {
  const { isDarkMode } = useTheme();
  const { isDopamineMode } = useDopamine();
  const { coins, multiplier } = useCoinsSystem();

  // Convert multiplier to class name (1 -> x1, 1.5 -> x1-5, 2 -> x2)
  const getMultiplierClass = (mult) => {
    if (mult === 1) return "multiplier-x1";
    if (mult === 1.5) return "multiplier-x1-5";
    if (mult === 2) return "multiplier-x2";
    return "multiplier-x1";
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">todo2</h1>
      </div>

      <motion.div
        className="header-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isDopamineMode && (
          <div className="header-stats">
            <div className="header-coins">
              <span className="coins-icon">💰</span>
              <span className="coins-value">{coins}</span>
            </div>
            <div
              className={`header-multiplier ${getMultiplierClass(multiplier)}`}
            >
              <span className="multiplier-icon">⚡</span>
              <span className="multiplier-value">{multiplier.toFixed(1)}x</span>
            </div>
          </div>
        )}
      </motion.div>

      <div className="header-right">
        <ProfileMenu />
      </div>
    </header>
  );
}
