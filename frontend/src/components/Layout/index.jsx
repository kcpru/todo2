
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { usePageTransition } from "../../context/PageTransitionContext";
import "./Layout.scss";

export function Layout() {
  const location = useLocation();
  const { directionRef } = usePageTransition();

  // Ustal animację na podstawie kierunku
  let initial, animate, exit;
  if (directionRef.current === "down") {
    initial = { opacity: 0, y: -30 };
    animate = { opacity: 1, y: 0 };
    exit = { opacity: 0, y: 30 };
  } else {
    // "up" lub domyślnie
    initial = { opacity: 0, y: 30 };
    animate = { opacity: 1, y: 0 };
    exit = { opacity: 0, y: -30 };
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
