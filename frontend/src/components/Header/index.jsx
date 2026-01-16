import { useTheme } from "../../ThemeContext";
import { useDopamine } from "../../DopamineContext";
import { GradientButton } from "../GradientButton";
import { NavTabs } from "../NavTabs";
import ProfileMenu from "./ProfileMenu";
import "./Header.scss";

export function Header() {
  // Theme and dopamine mode are used implicitly through CSS variables
  useTheme();
  useDopamine();

  // Coins system removed

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">todo2</h1>
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
