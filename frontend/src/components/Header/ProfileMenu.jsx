import { useState, useEffect } from "react";
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
import { getAvatarUrl } from "../../api/avatar";
import "./ProfileMenu.scss";

export function ProfileMenu() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { isDopamineMode, toggleDopamineMode } = useDopamine();

  return (
    <div className="profile-container">
      <button
        className="profile-avatar-btn"
        onClick={() => setShowProfile(!showProfile)}
        title={user?.username}
        type="button"
      >
        {(() => {
          const [avatarUrl, setAvatarUrl] = useState(null);
          useEffect(() => {
            let isMounted = true;
            if (user?.id) {
              const url = getAvatarUrl("me");
              const token = localStorage.getItem("token");
              if (!token) {
                setAvatarUrl(null);
                return;
              }
              fetch(url, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                  if (res.status === 200) return res.blob();
                  return null;
                })
                .then((blob) => {
                  if (isMounted) {
                    if (blob) {
                      setAvatarUrl(URL.createObjectURL(blob));
                    } else {
                      setAvatarUrl(null);
                    }
                  }
                });
            } else {
              setAvatarUrl(null);
            }
            return () => {
              isMounted = false;
            };
          }, [user?.id]);
          if (avatarUrl) {
            return (
              <img
                className="profile-avatar"
                src={avatarUrl}
                alt="avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
            );
          }
          return (
            <span className="profile-avatar-fallback">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </span>
          );
        })()}
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
