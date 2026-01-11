import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../ThemeContext";
import { useDopamine } from "../../DopamineContext";
import { useAuth } from "../../AuthContext";
import { ANIMATION_CONFIG } from "../../constants/animations";
import { MdLightMode, MdDarkMode, MdPsychology } from "react-icons/md";
import { GradientButton } from "../GradientButton";

export function ProfileMenu() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isDopamineMode, toggleDopamineMode } = useDopamine();

  return (
    <div className="profile-container">
      <motion.button
        className="profile-button"
        onClick={() => setShowProfile(!showProfile)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        title={user?.username}
      >
        {user?.username?.charAt(0).toUpperCase() || "U"}
      </motion.button>

      <AnimatePresence>
        {showProfile && (
          <motion.div className="profile-menu" {...ANIMATION_CONFIG.dropdown}>
            <div className="profile-info">
              <div className="profile-username">{user?.username}</div>
              <div className="profile-email">{user?.email}</div>
            </div>
            <GradientButton
              variant="secondary"
              size="md"
              className="profile-theme-btn"
              onClick={toggleTheme}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              icon={isDarkMode ? <MdLightMode /> : <MdDarkMode />}
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </GradientButton>
            <GradientButton
              variant="info"
              size="md"
              className="profile-dopamine-btn"
              onClick={toggleDopamineMode}
              title={
                isDopamineMode
                  ? "Disable Dopamine Mode"
                  : "Enable Dopamine Mode"
              }
              icon={<MdPsychology />}
            >
              {isDopamineMode ? " Dopamine Mode ON" : " Dopamine Mode OFF"}
            </GradientButton>
            <GradientButton
              variant="danger"
              size="md"
              className="profile-logout"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </GradientButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileMenu;
