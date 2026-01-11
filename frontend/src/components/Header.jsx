import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../ThemeContext";
import { useDopamine } from "../DopamineContext";
import { useAuth } from "../AuthContext";
import { useCoinsSystem } from "../hooks/useCoinsSystem";
import { ANIMATION_CONFIG } from "../constants/animations";
import { MdLightMode, MdDarkMode, MdPsychology } from "react-icons/md";
import "../styles/Header.scss";

export function Header() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isDopamineMode } = useDopamine();
  const { toggleDopamineMode } = useDopamine();
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
        <motion.button
          className="avatar-button"
          onClick={() => setShowProfile(!showProfile)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          title={user?.username}
        >
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </motion.button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              className="profile-dropdown"
              {...ANIMATION_CONFIG.dropdown}
            >
              <div className="profile-info">
                <div className="profile-username">{user?.username}</div>
                <div className="profile-email">{user?.email}</div>
              </div>
              <button
                className="profile-theme-btn"
                onClick={toggleTheme}
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? (
                  <>
                    <MdLightMode /> Light Mode
                  </>
                ) : (
                  <>
                    <MdDarkMode /> Dark Mode
                  </>
                )}
              </button>
              <button
                className="profile-dopamine-btn"
                onClick={toggleDopamineMode}
                title={
                  isDopamineMode
                    ? "Disable Dopamine Mode"
                    : "Enable Dopamine Mode"
                }
              >
                <MdPsychology />
                {isDopamineMode ? " Dopamine Mode ON" : " Dopamine Mode OFF"}
              </button>
              <button
                className="profile-logout"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
