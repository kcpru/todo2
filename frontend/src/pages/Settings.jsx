import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";
import { useDopamine } from "../DopamineContext";
import { useNotifications } from "../NotificationsContext";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/Input";
import { CustomSlider } from "../components/CustomSlider";
import {
  MdPhotoCamera,
  MdVisibility,
  MdVisibilityOff,
  MdPerson,
  MdLock,
  MdPalette,
  MdCelebration,
  MdInfo,
} from "react-icons/md";
import { uploadAvatar, getAvatarUrl } from "../api/avatar";
import "./Settings.scss";

export function Settings() {
  const [videoPreviewSize, setVideoPreviewSize] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { notify } = useNotifications();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const { user, updateProfile, changePassword } = useAuth();
  const {
    isDopamineMode,
    toggleDopamineMode,
    confettiCount,
    animationSpeed,
    updateConfettiCount,
    updateAnimationSpeed,
    videoEnabled,
    toggleVideoEnabled,
    videoSize,
    updateVideoSize,
  } = useDopamine();
  const [username, setUsername] = useState(user?.username || "");
  const [usernameWarning, setUsernameWarning] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const confettiCanvasRef = useRef(null);
  const animationBoxRef = useRef(null);

  const handleAvatarReset = async () => {
    setAvatarFile(null);
    setAvatarDataUrl("");
    try {
      // Send a blank avatar (or call a delete endpoint if backend supports)
      // Here, we simulate by uploading an empty 1x1 transparent PNG
      const emptyPng = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0,
        1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 13, 73, 68, 65,
        84, 120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 26, 10, 0, 0, 0, 0, 73,
        69, 78, 68, 174, 66, 96, 130,
      ]);
      const blob = new Blob([emptyPng], { type: "image/png" });
      const file = new File([blob], "avatar.png", { type: "image/png" });
      await uploadAvatar(file);
      setAvatarDataUrl("");
      notify({ message: "Avatar reset to default.", type: "success" });
    } catch (err) {
      notify({ message: "Failed to reset avatar", type: "error" });
    }
  };

  useEffect(() => {
    setUsername(user?.username || "");
    if (user?.id) {
      // Fetch avatar as blob with Authorization
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

  const fileInputRef = useRef(null);

  const handleAvatarPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    // Show preview
    const reader = new FileReader();
    reader.onload = async () => {
      setAvatarDataUrl(reader.result);
      // Auto-upload avatar and show feedback
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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      notify({ message: "Enter current and new password", type: "error" });
      return;
    }
    setChangingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    if (res.ok) {
      notify({ message: "Password changed", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } else {
      notify({
        message: res.error || "Failed to change password",
        type: "error",
      });
    }
    setChangingPassword(false);
  };

  // Confetti preview animation
  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = null;
    const w = (canvas.width = 220);
    const h = (canvas.height = 120);

    const maxPieces = Math.min(
      120,
      Math.max(0, Math.round((confettiCount / 300) * 120))
    );

    const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#AA6BFF"];

    const pieces = Array.from({ length: maxPieces }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * -h,
      r: 3 + Math.random() * 5,
      dx: (Math.random() - 0.5) * 1.2,
      dy: 0.6 + Math.random() * 2.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      dr: (Math.random() - 0.5) * 0.2,
    }));

    const speedScale = animationSpeed === "slow" ? 0.4 : 1;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pieces) {
        p.x += p.dx * speedScale;
        p.y += p.dy * speedScale;
        p.rot += p.dr * speedScale;

        if (p.y > h + 10) {
          p.y = -10 - Math.random() * h * 0.5;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [confettiCount, animationSpeed]);

  // Animation speed preview: update CSS animation duration
  useEffect(() => {
    const el = animationBoxRef.current;
    if (!el) return;
    const speed = Math.max(0.05, Number(animationSpeed) || 1);
    // base period 1s, scaled by 1/speed (higher speed -> faster)
    el.style.setProperty("animation-duration", `${(1 / speed).toFixed(2)}s`);
  }, [animationSpeed]);

  return (
    <div className="settings-page">
      <h2 className="settings-header">Settings</h2>
      <div className="settings-cards">
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
          <div className="profile-row">
            <div className="avatar-preview">
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
                <div className="avatar-placeholder">
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
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <GradientButton
                  size="sm"
                  icon={<MdPhotoCamera />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Avatar
                </GradientButton>
                <GradientButton
                  size="sm"
                  variant="danger"
                  onClick={handleAvatarReset}
                  title="Reset to default avatar"
                >
                  Reset
                </GradientButton>
              </div>
            </div>

            <div className="profile-fields">
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
              <div className="profile-actions">
                <GradientButton
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  title="Save display name"
                >
                  {savingProfile ? "Saving..." : "Save Name"}
                </GradientButton>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section security-section settings-card">
          <div className="settings-header-row">
            <MdLock className="settings-section-icon" />
            <div>
              <h3>Security</h3>
              <div className="settings-section-desc">
                Change your password for better account safety.
              </div>
            </div>
          </div>
          <div className="security-row">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
            />
            <div className="profile-actions">
              <GradientButton
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? "..." : "Change Password"}
              </GradientButton>
            </div>
          </div>
        </section>

        <section className="settings-section theme-section settings-card">
          <div className="settings-header-row">
            <MdPalette className="settings-section-icon" />
            <div>
              <h3>Theme</h3>
              <div className="settings-section-desc">
                Personalize the app's color mode.
              </div>
            </div>
          </div>
          <div className="theme-row">
            <span className="theme-label">Color mode</span>
            <GradientButton
              variant={isDarkMode ? "primary" : "secondary"}
              onClick={toggleTheme}
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? "Dark" : "Light"}
            </GradientButton>
          </div>
        </section>

        <section className="settings-section dopamine-section settings-card">
          <div className="settings-header-row">
            <MdCelebration className="settings-section-icon" />
            <div>
              <h3>Dopamine Effects</h3>
              <div className="settings-section-desc">
                Fun effects and video for extra motivation.
              </div>
            </div>
          </div>
          <div className="dopamine-row">
            <div className="dopamine-controls">
              <div className="dopamine-toggle-row">
                <span className="dopamine-label">Enable Dopamine Mode</span>
                <GradientButton
                  variant={isDopamineMode ? "primary" : "secondary"}
                  onClick={toggleDopamineMode}
                >
                  {isDopamineMode ? "On" : "Off"}
                </GradientButton>
              </div>

              <div className="dopamine-field dopamine-with-preview">
                <div className="dopamine-field-main">
                  <CustomSlider
                    min={0}
                    max={100}
                    step={10}
                    value={confettiCount}
                    onChange={(e) => updateConfettiCount(e.target.value)}
                    label="Confetti amount"
                  />
                  <div className="confetti-slider-info">
                    <span className="confetti-slider-value">
                      {confettiCount}
                    </span>
                    <span className="confetti-slider-desc">
                      - Number of confetti particles per burst
                    </span>
                  </div>
                </div>
                <div className="dopamine-preview">
                  <canvas ref={confettiCanvasRef} className="preview-canvas" />
                </div>
              </div>

              <div className="dopamine-field dopamine-with-preview">
                <div className="dopamine-field-main">
                  <span className="dopamine-label">Animation speed</span>
                  <div className="speed-toggle-row">
                    <GradientButton
                      variant={
                        animationSpeed === "fast" ? "primary" : "secondary"
                      }
                      onClick={() => updateAnimationSpeed("fast")}
                      size="sm"
                    >
                      Fast
                    </GradientButton>
                    <GradientButton
                      variant={
                        animationSpeed === "slow" ? "primary" : "secondary"
                      }
                      onClick={() => updateAnimationSpeed("slow")}
                      size="sm"
                    >
                      Slow
                    </GradientButton>
                  </div>
                </div>
                <div className="dopamine-preview">
                  <div className={`speed-preview-bar ${animationSpeed}`}></div>
                </div>
              </div>

              <div className="dopamine-field dopamine-video-row">
                <div className="dopamine-video-group">
                  <div className="dopamine-video-toggle-row">
                    <span className="dopamine-label">Dopamine video</span>
                    <GradientButton
                      variant={videoEnabled ? "primary" : "secondary"}
                      onClick={toggleVideoEnabled}
                      size="sm"
                    >
                      {videoEnabled ? "On" : "Off"}
                    </GradientButton>
                  </div>
                  <div className="dopamine-video-size-row">
                    <span className="dopamine-label">Size</span>
                    <GradientButton
                      variant={videoSize === "small" ? "primary" : "secondary"}
                      onClick={() => updateVideoSize("small")}
                      size="sm"
                      onMouseEnter={() => setVideoPreviewSize("small")}
                      onMouseLeave={() => setVideoPreviewSize(null)}
                    >
                      Small
                    </GradientButton>
                    <GradientButton
                      variant={videoSize === "medium" ? "primary" : "secondary"}
                      onClick={() => updateVideoSize("medium")}
                      size="sm"
                      style={{ marginLeft: "0.5rem" }}
                      onMouseEnter={() => setVideoPreviewSize("medium")}
                      onMouseLeave={() => setVideoPreviewSize(null)}
                    >
                      Medium
                    </GradientButton>
                    <GradientButton
                      variant={videoSize === "large" ? "primary" : "secondary"}
                      onClick={() => updateVideoSize("large")}
                      size="sm"
                      style={{ marginLeft: "0.5rem" }}
                      onMouseEnter={() => setVideoPreviewSize("large")}
                      onMouseLeave={() => setVideoPreviewSize(null)}
                    >
                      Large
                    </GradientButton>
                    {/* Video preview box in video position */}
                    {videoPreviewSize && (
                      <div
                        className={`video-size-preview video-size-preview--${videoPreviewSize}`}
                        data-label={
                          videoPreviewSize === "small"
                            ? "Small"
                            : videoPreviewSize === "medium"
                              ? "Medium"
                              : "Large"
                        }
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="settings-section about-section settings-card">
          <div className="settings-header-row">
            <MdInfo className="settings-section-icon" />
            <div>
              <h3>About</h3>
              <div className="settings-section-desc">
                App info, repository and contact details.
              </div>
            </div>
          </div>
          <div className="about-content">
            <div className="about-row">
              <span className="about-label">App version:</span>
              <span className="about-value">2.0.0</span>
            </div>
            <div className="about-row">
              <span className="about-label">Repository:</span>
              <a
                className="about-link"
                href="https://github.com/kcpru/todo2"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/kcpru/todo2
              </a>
            </div>
            <div className="about-row">
              <span className="about-label">Contact:</span>
              <a className="about-link" href="mailto:support@todo2.app">
                support@todo2.app
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
