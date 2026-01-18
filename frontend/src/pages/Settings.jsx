import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useDopamine } from "../DopamineContext";
import { useNotifications } from "../NotificationsContext";
import { GradientButton } from "../components/GradientButton";
import { Input } from "../components/Input";
import { MdPhotoCamera } from "react-icons/md";
import "./Settings.scss";

export function Settings() {
  const { user, updateProfile, changePassword } = useAuth();
  const {
    isDopamineMode,
    toggleDopamineMode,
    confettiCount,
    animationSpeed,
    updateConfettiCount,
    updateAnimationSpeed,
  } = useDopamine();
  const { notify } = useNotifications();

  const [username, setUsername] = useState(user?.username || "");
  const [avatarDataUrl, setAvatarDataUrl] = useState(
    () => localStorage.getItem("avatarDataUrl") || user?.avatar || ""
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const confettiCanvasRef = useRef(null);
  const animationBoxRef = useRef(null);

  useEffect(() => {
    setUsername(user?.username || "");
  }, [user?.username]);

  const fileInputRef = useRef(null);

  const handleAvatarPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarDataUrl(reader.result);
    };
    reader.readAsDataURL(f);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      localStorage.setItem("avatarDataUrl", avatarDataUrl || "");
      const res = await updateProfile({ username, avatar: avatarDataUrl });
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

    const speedScale = Math.max(0.1, Number(animationSpeed) || 1);

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
      <h2>Settings</h2>

      <section className="settings-section profile-section">
        <h3>Profile</h3>
        <div className="profile-row">
          <div className="avatar-preview">
            {avatarDataUrl ? (
              <img src={avatarDataUrl} alt="Avatar" />
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
            <GradientButton
              size="sm"
              icon={<MdPhotoCamera />}
              onClick={() => fileInputRef.current?.click()}
            >
              Change Avatar
            </GradientButton>
          </div>

          <div className="profile-fields">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Display name"
            />
            <div className="profile-actions">
              <GradientButton
                onClick={handleSaveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </GradientButton>
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section security-section">
        <h3>Security</h3>
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

      <section className="settings-section dopamine-section">
        <h3>Dopamine Effects</h3>
        <div className="dopamine-row">
          <label>Enable Dopamine Mode</label>
          <div className="dopamine-controls">
            <GradientButton
              variant={isDopamineMode ? "primary" : "secondary"}
              onClick={toggleDopamineMode}
            >
              {isDopamineMode ? "On" : "Off"}
            </GradientButton>

            <div className="dopamine-field dopamine-with-preview">
              <div className="dopamine-field-main">
                <label>Confetti amount</label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={confettiCount}
                  onChange={(e) => updateConfettiCount(e.target.value)}
                />
                <div className="value">{confettiCount}</div>
              </div>
              <div className="dopamine-preview">
                <div className="preview-label">Preview</div>
                <canvas ref={confettiCanvasRef} className="preview-canvas" />
              </div>
            </div>

            <div className="dopamine-field dopamine-with-preview">
              <div className="dopamine-field-main">
                <label>Animation speed (scale)</label>
                <input
                  type="range"
                  min="0.25"
                  max="2"
                  step="0.05"
                  value={animationSpeed}
                  onChange={(e) => updateAnimationSpeed(e.target.value)}
                />
                <div className="value">{animationSpeed}</div>
              </div>
              <div className="dopamine-preview">
                <div className="preview-label">Speed</div>
                <div className="preview-box" ref={animationBoxRef} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;
