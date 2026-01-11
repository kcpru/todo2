import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../ThemeContext";
import { useDopamine } from "../../DopamineContext";
import { useAuth } from "../../AuthContext";
import { ANIMATION_CONFIG } from "../../constants/animations";
import {
  MdLightMode,
  MdDarkMode,
  MdPsychology,
  MdLogout,
  MdPerson,
} from "react-icons/md";
import { GradientButton } from "../GradientButton";

export function ProfileMenu() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isDopamineMode, toggleDopamineMode } = useDopamine();

  return (
    <div className="profile-container">
      <GradientButton
        variant="primary"
        size="md"
        iconOnly
        className="profile-button"
        onClick={() => setShowProfile(!showProfile)}
        title={user?.username}
      >
        {user?.username?.charAt(0).toUpperCase() || "U"}
      </GradientButton>

      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div
              className="profile-overlay-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              onClick={() => setShowProfile(false)}
            />
            <motion.div
              className="profile-modal"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.16 }}
            >
              <div className="profile-modal__header">
                <div className="profile-avatar">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="profile-modal__info">
                  <div className="profile-username">{user?.username}</div>
                  <div className="profile-email">{user?.email}</div>
                </div>
              </div>

              <div className="profile-actions">
                <GradientButton
                  variant="secondary"
                  size="md"
                  className="profile-action-btn"
                  onClick={toggleTheme}
                  title={isDarkMode ? "Light Mode" : "Dark Mode"}
                  icon={isDarkMode ? <MdLightMode /> : <MdDarkMode />}
                >
                  {isDarkMode ? "Switch to Light" : "Switch to Dark"}
                </GradientButton>

                <GradientButton
                  variant="info"
                  size="md"
                  className="profile-action-btn"
                  onClick={toggleDopamineMode}
                  title={
                    isDopamineMode
                      ? "Disable Dopamine Mode"
                      : "Enable Dopamine Mode"
                  }
                  icon={<MdPsychology />}
                >
                  {isDopamineMode ? "Dopamine Mode ON" : "Dopamine Mode OFF"}
                </GradientButton>

                <GradientButton
                  variant="danger"
                  size="md"
                  className="profile-action-btn"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  icon={<MdLogout />}
                >
                  Logout
                </GradientButton>
              </div>

              <div className="profile-footer">
                <MdPerson className="footer-icon" />
                <span>Manage your vibe & settings</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileMenu;
