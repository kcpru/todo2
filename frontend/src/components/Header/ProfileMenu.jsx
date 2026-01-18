import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import { useDopamine } from "../../DopamineContext";
import { useAuth } from "../../AuthContext";
import {
  MdLightMode,
  MdDarkMode,
  MdPsychology,
  MdLogout,
  MdSettings,
} from "react-icons/md";
import { GradientButton } from "../GradientButton";
import { DropdownMenu } from "../DropdownMenu";
import "./ProfileMenu.scss";
import "./ProfileMenu.scss";

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
        {(() => {
          const stored = localStorage.getItem("avatarDataUrl");
          const avatar = user?.avatar || stored;
          if (avatar) {
            return <img className="profile-avatar" src={avatar} alt="avatar" />;
          }
          return user?.username?.charAt(0).toUpperCase() || "U";
        })()}
      </GradientButton>

      <DropdownMenu
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        position="bottom-right"
      >
        <div className="profile-info">
          <div className="profile-username">{user?.username}</div>
          <div className="profile-email">{user?.email}</div>
        </div>
        <div className="profile-buttons">
          <GradientButton
            variant="secondary"
            size="md"
            onClick={toggleTheme}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
            icon={isDarkMode ? <MdLightMode /> : <MdDarkMode />}
          >
            {isDarkMode ? "Light" : "Dark"}
          </GradientButton>
          <GradientButton
            variant="info"
            size="md"
            onClick={toggleDopamineMode}
            title={
              isDopamineMode
                ? "Switch to Dopamine Mode"
                : "Switch to Focus Mode"
            }
            icon={<MdPsychology />}
          >
            {isDopamineMode ? "Focus Mode" : "Dopamine Mode"}
          </GradientButton>
          <GradientButton
            variant="secondary"
            size="md"
            onClick={() => navigate("/settings")}
            icon={<MdSettings />}
          >
            Settings
          </GradientButton>
          <GradientButton
            variant="danger"
            size="md"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            icon={<MdLogout />}
          >
            Logout
          </GradientButton>
        </div>
      </DropdownMenu>
    </div>
  );
}

export default ProfileMenu;
