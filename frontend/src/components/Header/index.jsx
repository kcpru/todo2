import { useDopamine } from "@context/DopamineContext";
import { useTheme } from "@context/ThemeContext";

import { NavTabs } from "../NavTabs";

import { AppLogoLottie } from "./AppLogoLottie";
import ProfileMenu from "./ProfileMenu";
import "./Header.scss";

export function Header() {
  useTheme();
  useDopamine();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-logo-title">
          <AppLogoLottie />
          <div className="app-title-group">
            <span className="app-title">todo2</span>
            <span className="app-slogan">get sh*t done</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <NavTabs />
      </div>

      <div className="header-right">
        <ProfileMenu />
      </div>
    </header>
  );
}
