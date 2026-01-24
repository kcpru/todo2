import { useLocation, useNavigate } from "react-router-dom";
import { usePageTransition } from "@context/PageTransitionContext";
import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { NavTab } from "./NavTab";
import homeLottie from "@assets/lottie/system-solid-41-home-hover-pinch.json";
import todoLottie from "@assets/lottie/system-solid-17-assignment-hover-assignment.json";
import statsLottie from "@assets/lottie/system-solid-10-analytics-hover-analytics.json";
import settingsLottie from "@assets/lottie/system-solid-63-settings-cog-hover-cog-4.json";
import "./NavTabs.scss";
import "./NavTab.scss";

const TABS = [
  { label: "Home", path: "/", lottie: homeLottie },
  { label: "Todo", path: "/todo", lottie: todoLottie },
  { label: "Stats", path: "/stats", lottie: statsLottie },
  { label: "Settings", path: "/settings", lottie: settingsLottie },
];

export function NavTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTransition, lastTabIndexRef } = usePageTransition();

  // Każdy tab ma własny obiekt ref
  const lottieRefs = React.useRef(TABS.map(() => React.createRef()));

  const handleTabClick = (idx, path) => {
    setTransition(lastTabIndexRef.current, idx);
    navigate(path);
    const ref = lottieRefs.current[idx];
    if (ref && ref.current) {
      ref.current.stop();
      ref.current.play();
    }
  };

  useEffect(() => {
    const activeIdx = TABS.findIndex((tab) => tab.path === location.pathname);
    const ref = lottieRefs.current[activeIdx];
    if (activeIdx !== -1 && ref && ref.current) {
      ref.current.stop();
      ref.current.play();
    }
  }, [location.pathname]);

  return (
    <div className="nav-tabs-header">
      {TABS.map((tab, idx) => {
        const isActive = location.pathname === tab.path;

        return (
          <NavTab
            key={tab.path}
            idx={idx}
            tab={tab}
            isActive={isActive}
            onClick={() => handleTabClick(idx, tab.path)}
            lottieRef={lottieRefs.current[idx]}
          />
        );
      })}
    </div>
  );
}
