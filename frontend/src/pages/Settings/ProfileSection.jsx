import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import { GradientButton } from "../../components/GradientButton";
import { Input } from "../../components/Input";
import { MdPhotoCamera, MdPerson } from "react-icons/md";
import { uploadAvatar, getAvatarUrl } from "../../api/avatar";
import "./Settings.scss";

export default function ProfileSection() {
  const { user, updateProfile } = useAuth();
  const { notify } = useNotifications();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [username, setUsername] = useState(user?.username || "");
  const [usernameWarning, setUsernameWarning] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setUsername(user?.username || "");
    if (user?.id) {
      const url = getAvatarUrl("me");
      const token = localStorage.getItem("token");
      if (!token) {
        setAvatarDataUrl("");
        return;
      }
      fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          if (res.status === 200) return res.blob();
          return null;
        })
        .then((blob) => {
          if (blob) {
            setAvatarDataUrl(URL.createObjectURL(blob));
          } else {
            setAvatarDataUrl("");
          }
        })
        .catch(() => setAvatarDataUrl(""));
    } else {
      setAvatarDataUrl("");
    }
  }, [user?.username, user?.id]);

  const handleAvatarPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    const reader = new FileReader();
    reader.onload = async () => {
      setAvatarDataUrl(reader.result);
      try {
        await uploadAvatar(f);
        setAvatarFile(null);
        setAvatarDataUrl(getAvatarUrl("me") + `?t=${Date.now()}`);
        notify({ message: "Avatar updated!", type: "success" });
      } catch (err) {
        notify({ message: "Failed to update avatar", type: "error" });
      }
    };
    reader.readAsDataURL(f);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setUsernameWarning("");
    if (!username.trim()) {
      setUsernameWarning("Username cannot be empty");
      setSavingProfile(false);
      return;
    }
    if (username.length < 3) {
      setUsernameWarning("Username must be at least 3 characters");
      setSavingProfile(false);
      return;
    }
    try {
      const res = await updateProfile({ username });
      if (res.ok) {
        notify({ message: "Profile updated", type: "success" });
      } else {
        notify({ message: res.error || "Updated locally", type: "warning" });
      }
    } catch (err) {
      notify({ message: "Failed to update profile", type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <section className="settings-section profile-section settings-card">
      <div className="settings-header-row">
        <MdPerson className="settings-section-icon" />
        <div>
          <h3>Profile</h3>
          <div className="settings-section-desc">
            Manage your display name and avatar.
          </div>
        </div>
      </div>
      <div className="profile-row profile-row-modern">
        <div className="profile-avatar-card">
          <div className="avatar-preview avatar-preview-large">
            {avatarDataUrl ? (
              <img
                src={avatarDataUrl}
                alt="Avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
            ) : (
              <div className="avatar-placeholder avatar-placeholder-large">
                {(username || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarPick}
              style={{ display: "none" }}
            />
            <div className="avatar-actions">
              <GradientButton
                size="sm"
                icon={<MdPhotoCamera />}
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </GradientButton>
            </div>
          </div>
        </div>
        <div className="profile-fields-card">
          <div className="profile-fields">
            <div className="profile-user-row">
              <span className="profile-username-large">{user?.username}</span>
              <span className="profile-email-large">{user?.email}</span>
            </div>
            <Input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameWarning("");
              }}
              placeholder="Display name"
            />
            {usernameWarning && (
              <div className="input-warning">{usernameWarning}</div>
            )}
            <div className="profile-actions profile-actions-row">
              <GradientButton
                size="sm"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                title="Save display name"
              >
                {savingProfile ? "Saving..." : "Save Name"}
              </GradientButton>
              <GradientButton
                size="sm"
                variant="danger"
                onClick={() => {
                  if (window.confirm("Are you sure you want to log out?")) {
                    window.localStorage.removeItem("token");
                    window.location.href = "/login";
                  }
                }}
              >
                Logout
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
