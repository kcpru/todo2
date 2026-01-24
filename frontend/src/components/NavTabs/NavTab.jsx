import Lottie from "lottie-react";
import { motion } from "motion/react";
import React from "react";
import "./NavTab.scss";

export function NavTab({ tab, idx, isActive, onClick, lottieRef, layoutId }) {
  return (
    <motion.button
      className={`nav-tab-header${isActive ? " active" : ""}`}
      data-tab={tab.label}
      onClick={onClick}
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 32,
        delay: 0.15 + idx * 0.05,
      }}
    >
      {isActive && <motion.div className="tab-bg" layoutId={layoutId} layout />}

      <span className="nav-tab-icon lottie-color">
        <Lottie
          lottieRef={lottieRef}
          animationData={tab.lottie}
          loop={false}
          autoplay={false}
          style={{ width: 32, height: 32 }}
          rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
        />
      </span>
      <span className="nav-tab-label-main">{tab.label}</span>
    </motion.button>
  );
}
