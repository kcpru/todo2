import React, { useEffect } from "react";
import { useCoinsSystem } from "../hooks/useCoinsSystem";
import { useDopamine } from "../DopamineContext";
import { motion } from "motion/react";
import "../styles/CoinsDisplay.scss";

export function CoinsDisplay({ completedCount }) {
  const { isDopamineMode } = useDopamine();
  const { coins, multiplier, updateCompletedCount } = useCoinsSystem();

  // Update completed count when it changes
  useEffect(() => {
    updateCompletedCount(completedCount);
  }, [completedCount, updateCompletedCount]);

  if (!isDopamineMode) return null;

  return (
    <motion.div
      className="coins-display"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="coins-section">
        <div className="coins-label">💰 Coins</div>
        <motion.div
          className="coins-amount"
          key={coins}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          {coins}
        </motion.div>
      </div>

      <div className="multiplier-section">
        <div className="multiplier-label">⚡ Multiplier</div>
        <motion.div
          className={`multiplier-value multiplier-${Math.floor(
            multiplier * 10
          )}`}
          animate={{
            backgroundColor:
              multiplier >= 2
                ? "rgba(255, 69, 0, 0.3)"
                : multiplier >= 1.5
                ? "rgba(255, 165, 0, 0.3)"
                : "rgba(85, 104, 211, 0.2)",
          }}
          transition={{ duration: 0.3 }}
        >
          {multiplier.toFixed(1)}x
        </motion.div>
      </div>

      <div className="completed-counter">
        <div className="counter-label">✅ Completed</div>
        <div className="counter-value">{completedCount}</div>
      </div>
    </motion.div>
  );
}
