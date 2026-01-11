import { useState } from "react";
import { useTheme } from "../../ThemeContext";
import { useDopamine } from "../../DopamineContext";
import { useAuth } from "../../AuthContext";
import { motion } from "motion/react";
import { GradientButton } from "../GradientButton";
import ProfileMenu from "./ProfileMenu";
import "./Header.scss";

export function Header() {
  const { isDarkMode } = useTheme();
  const { isDopamineMode } = useDopamine();

  // Coins system removed

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">todo2</h1>
      </div>

      <div className="header-center" />

      <div className="header-right">
        <ProfileMenu />
      </div>
    </header>
  );
}
