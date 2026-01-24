import { useState, useEffect, useRef } from "react";
import { useAuth } from "@context/AuthContext";
import { useNotifications } from "@context/NotificationsContext";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { MdPhotoCamera, MdPerson, MdShuffle } from "react-icons/md";
import { uploadAvatar } from "@api/avatar";
import { RandomAvatarModal } from "./RandomAvatarModal";
import HeaderRow from "@components/HeaderRow";
import "./Settings.scss";

export default function ProfileSection() {
  const { user, updateProfile, avatarUrl, fetchAvatarUrl } = useAuth();
  const { notify } = useNotifications();
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [usernameWarning, setUsernameWarning] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setUsername(user?.username || "");
  }, [user?.username]);

  useEffect(() => {
    if (user?.id) fetchAvatarUrl();
  }, [user?.id]);

  const handleAvatarPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      await uploadAvatar(f);
      await fetchAvatarUrl();
      notify({ message: "Avatar updated!", type: "success" });
    } catch {
      notify({ message: "Failed to update avatar", type: "error" });
    }
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
    } catch {
      notify({ message: "Failed to update profile", type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleRandomAvatar = () => {
    setIsRandomModalOpen(true);
  };

  const handleSetRandomAvatar = async (svgUrl) => {
    try {
      const res = await fetch(svgUrl);
      const blob = await res.blob();
      const file = new File([blob], "avatar.svg", { type: "image/svg+xml" });
      await uploadAvatar(file);
      await fetchAvatarUrl();
      notify({ message: "Random avatar set as profile!", type: "success" });
      setIsRandomModalOpen(false);
    } catch (err) {
      notify({ message: err.message || "Failed to set avatar", type: "error" });
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <section className="settings-section profile-section settings-card">
      <div className="settings-header-row">
        <HeaderRow
          icon={<MdPerson className="settings-section-icon" />}
          title="Profile"
          subtitle="Manage your display name and avatar."
        />
      </div>
      <div className="profile-row profile-row-modern">
        <div className="profile-avatar-card">
          <div className="avatar-preview avatar-preview-large">
            {avatarUrl ? (
              <img
                src={avatarUrl}
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
            <div className="avatar-actions" style={{ display: "flex", gap: 8 }}>
              <Button
                size="sm"
                icon={<MdPhotoCamera />}
                onClick={handleAvatarFileClick}
              >
                Change
              </Button>
              <Button
                size="sm"
                variant="primary"
                icon={<MdShuffle />}
                onClick={handleRandomAvatar}
              >
                Random
              </Button>
            </div>
            <RandomAvatarModal
              isOpen={isRandomModalOpen}
              onClose={() => setIsRandomModalOpen(false)}
              onSave={handleSetRandomAvatar}
            />
          </div>
        </div>
        <div className="profile-fields-card">
          <div className="profile-fields">
            <Input value={user?.email || ""} disabled placeholder="Email" />
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
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                title="Save display name"
              >
                {savingProfile ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
