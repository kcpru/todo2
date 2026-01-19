import ProfileSection from "./ProfileSection";
import SecuritySection from "./SecuritySection";
import ThemeSection from "./ThemeSection";
import DopamineSection from "./DopamineSection";
import AboutSection from "./AboutSection";
import "./Settings.scss";

export function Settings() {
  return (
    <div className="settings-page">
      <div className="settings-cards">
        <ProfileSection />
        <SecuritySection />
        <ThemeSection />
        <DopamineSection />
        <AboutSection />
      </div>
    </div>
  );
}

export default Settings;
