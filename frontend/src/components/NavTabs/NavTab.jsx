import React from "react";
import { motion } from "motion/react";
import Lottie from "lottie-react";
import "./NavTab.scss";

export function NavTab({ tab, isActive, onClick, lottieRef }) {
  return (
    <button
      className={`nav-tab-header${isActive ? " active" : ""}`}
      data-tab={tab.label}
      onClick={onClick}
    >
      {isActive && <motion.div className="tab-bg" layoutId="tab-bg" />}
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
    </button>
  );
}
