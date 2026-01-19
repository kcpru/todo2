import { motion } from "motion/react";
import { MdFavorite } from "react-icons/md";
import { useDopamine } from "../../context/DopamineContext";
import "./ConfettiPop.scss";

export function ConfettiPop({ x, y }) {
  const { animationSpeed } = useDopamine();
  const particleCount = Math.floor(Math.random() * 3) + 6;
  const duration = animationSpeed === "slow" ? 1.2 : 0.6;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (360 / particleCount) * i + (Math.random() - 0.5) * 30,
    duration: duration + Math.random() * 0.3,
  }));

  return (
    <div
      className="confetti-pop-container"
      style={{
        position: "fixed",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {particles.map((particle) => {
        const radians = (particle.angle * Math.PI) / 180;
        const distance = 60 + Math.random() * 40;
        const endX = Math.cos(radians) * distance;
        const endY = Math.sin(radians) * distance;

        return (
          <motion.div
            key={particle.id}
            className="confetti-particle"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: endX,
              y: endY,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: particle.duration,
              ease: "easeOut",
            }}
          >
            <MdFavorite />
          </motion.div>
        );
      })}
    </div>
  );
}
