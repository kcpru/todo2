import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  MdLeaderboard,
  MdHome,
  MdCheckCircle,
  MdSettings,
} from "react-icons/md";
import "./NavTabs.scss";

const TABS = [
  { label: "Home", icon: MdHome, path: "/" },
  { label: "Todo", icon: MdCheckCircle, path: "/todo" },
  { label: "Stats", icon: MdLeaderboard, path: "/stats" },
  { label: "Settings", icon: MdSettings, path: "/settings" },
];

export function NavTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="nav-tabs-header">
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            className={`nav-tab-header${isActive ? " active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            {isActive && <motion.div className="tab-bg" layoutId="tab-bg" />}
            <Icon className="nav-tab-icon" />
            <span className="nav-tab-label-main">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
