import { motion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";

import { usePageTransition } from "@context/PageTransitionContext";
import "./Layout.scss";

export function Layout() {
  const location = useLocation();
  const { directionRef } = usePageTransition();

  // Ustal animację na podstawie kierunku (lewo/prawo)
  let initial, animate, exit;
  if (directionRef.current === "down") {
    // Przejście w prawo
    initial = { opacity: 0, x: 60 };
    animate = { opacity: 1, x: 0 };
    exit = { opacity: 0, x: -60 };
  } else {
    // "up" lub domyślnie: przejście w lewo
    initial = { opacity: 0, x: -60 };
    animate = { opacity: 1, x: 0 };
    exit = { opacity: 0, x: 60 };
  }

  return (
    <div className="layout-wrapper">
      <motion.div
        key={location.pathname}
        className="layout-content"
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
