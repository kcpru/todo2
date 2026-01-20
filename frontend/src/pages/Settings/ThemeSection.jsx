import { useTheme } from "@context/ThemeContext";
import { GradientButton } from "@components/GradientButton";
import { MdPalette } from "react-icons/md";
import "./Settings.scss";

export default function ThemeSection() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
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
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? "Dark" : "Light"}
        </GradientButton>
      </div>
    </section>
  );
}
