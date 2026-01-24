import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@context/ThemeContext";
import { useDopamine } from "@context/DopamineContext";
import { useAuth } from "@context/AuthContext";
import {
  MdLightMode,
  MdDarkMode,
  MdPsychology,
  MdLogout,
  MdSettings,
} from "react-icons/md";
import { Button } from "../Button";
import { DropdownMenu } from "../DropdownMenu";
import "./ProfileMenu.scss";
import { useClickOutside } from "@hooks/useClickOutside";

export function ProfileMenu() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout, avatarUrl, fetchAvatarUrl } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isDopamineMode, toggleDopamineMode } = useDopamine();
  const profileRef = useRef(null);

  useClickOutside(profileRef, () => setShowProfile(false));

  useEffect(() => {
    if (user?.id) {
      fetchAvatarUrl();
    }
    // eslint-disable-next-line
  }, [user?.id]);

  return (
    <div className="profile-container" ref={profileRef}>
      <button
        className="profile-avatar-btn"
        onClick={() => setShowProfile(!showProfile)}
        title={user?.username}
        type="button"
      >
        {avatarUrl ? (
          <img
            className="profile-avatar"
            src={avatarUrl}
            alt="avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          />
        ) : (
          <span className="profile-avatar-fallback">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </span>
        )}
      </button>

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
          <Button
            variant="secondary"
            size="md"
            onClick={toggleTheme}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
            icon={isDarkMode ? <MdLightMode /> : <MdDarkMode />}
          >
            {isDarkMode ? "Light" : "Dark"}
          </Button>
          <Button
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
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate("/settings")}
            icon={<MdSettings />}
          >
            Settings
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            icon={<MdLogout />}
          >
            Logout
          </Button>
        </div>
      </DropdownMenu>
    </div>
  );
}

export default ProfileMenu;
