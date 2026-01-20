import { Outlet, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import "./Layout.scss";

export function Layout() {
  const location = useLocation();
  return (
    <div className="layout-wrapper">
      <motion.div
        key={location.pathname}
        className="layout-content"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
