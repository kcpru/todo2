import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import { GradientButton } from "../../components/GradientButton";
import { Input } from "../../components/Input";
import { MdLock } from "react-icons/md";
import "./Settings.scss";

export default function SecuritySection() {
  const { changePassword } = useAuth();
  const { notify } = useNotifications();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

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

  return (
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
  );
}
