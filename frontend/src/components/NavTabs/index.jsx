import { motion, LayoutGroup } from "motion/react";
import React, { useEffect, useId, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import statsLottie from "@assets/lottie/system-solid-10-analytics-hover-analytics.json";
import todoLottie from "@assets/lottie/system-solid-17-assignment-hover-assignment.json";
import homeLottie from "@assets/lottie/system-solid-41-home-hover-pinch.json";
import settingsLottie from "@assets/lottie/system-solid-63-settings-cog-hover-cog-4.json";
import { usePageTransition } from "@context/PageTransitionContext";

import { NavTab } from "./NavTab";

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
  const layoutId = useId();

  // Każdy tab ma własny obiekt ref
  const lottieRefs = useMemo(() => TABS.map(() => React.createRef()), []);

  const handleTabClick = (idx, path) => {
    setTransition(lastTabIndexRef.current, idx);
    navigate(path);
    const ref = lottieRefs[idx];
    if (ref && ref.current) {
      ref.current.stop();
      ref.current.play();
    }
  };

  useEffect(() => {
    const activeIdx = TABS.findIndex((tab) => tab.path === location.pathname);
    const ref = lottieRefs[activeIdx];
    if (activeIdx !== -1 && ref && ref.current) {
      ref.current.stop();
      ref.current.play();
    }
  }, [location.pathname, lottieRefs]);

  return (
    <LayoutGroup>
      <motion.div className="nav-tabs-header" layoutRoot layoutScroll>
        {TABS.map((tab, idx) => {
          const isActive = location.pathname === tab.path;

          return (
            <NavTab
              key={tab.path}
              idx={idx}
              tab={tab}
              isActive={isActive}
              onClick={() => handleTabClick(idx, tab.path)}
              lottieRef={lottieRefs[idx]}
              layoutId={`${layoutId}-tab-bg`}
            />
          );
        })}
      </motion.div>
    </LayoutGroup>
  );
}
