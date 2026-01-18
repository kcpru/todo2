import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { MdLeaderboard, MdHome, MdCheckCircle } from "react-icons/md";
import "./NavTabs.scss";

export function NavTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isTodo = location.pathname === "/my-todo";
  const isStats = location.pathname === "/stats";

  return (
    <div className="nav-tabs-header modern">
      <button
        className={`nav-tab-header modern ${isHome ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        {isHome && <motion.div className="tab-bg" layoutId="tab-bg" />}
        <MdHome className="nav-tab-icon" />
        <span className="nav-tab-label-main">Home</span>
      </button>
      <button
        className={`nav-tab-header modern ${isTodo ? "active" : ""}`}
        onClick={() => navigate("/my-todo")}
      >
        {isTodo && <motion.div className="tab-bg" layoutId="tab-bg" />}
        <MdCheckCircle className="nav-tab-icon" />
        <span className="nav-tab-label-main">My Todo</span>
      </button>
      <button
        className={`nav-tab-header modern ${isStats ? "active" : ""}`}
        onClick={() => navigate("/stats")}
      >
        {isStats && <motion.div className="tab-bg" layoutId="tab-bg" />}
        <MdLeaderboard className="nav-tab-icon" />
        <span className="nav-tab-label-main">Stats</span>
      </button>
    </div>
  );
}
