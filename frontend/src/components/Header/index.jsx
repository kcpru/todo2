import { useTheme } from "@context/ThemeContext";
import { useDopamine } from "@context/DopamineContext";
import { NavTabs } from "../NavTabs";
import ProfileMenu from "./ProfileMenu";
import { MdCheckCircle } from "react-icons/md";
import "./Header.scss";
import { useEffect } from "react";

export function Header() {
  useTheme();
  useDopamine();

  useEffect(() => {
    console.log("Header mounted");
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-logo-title">
          <MdCheckCircle className="app-logo" />
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
