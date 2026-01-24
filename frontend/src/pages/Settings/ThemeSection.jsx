import { MdPalette } from "react-icons/md";

import HeaderRow from "@components/HeaderRow";
import ToggleRow from "@components/ToggleRow";
import { useTheme } from "@context/ThemeContext";

import "./Settings.scss";

export default function ThemeSection() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <section className="settings-section theme-section settings-card">
      <div className="settings-header-row">
        <HeaderRow
          icon={<MdPalette className="settings-section-icon" />}
          title="Theme"
          subtitle="Personalize the app's color mode."
        />
      </div>
      <div className="theme-row">
        <ToggleRow
          label="Dark mode"
          value={isDarkMode}
          onChange={toggleTheme}
          className="theme-toggle-row"
        />
      </div>
    </section>
  );
}
