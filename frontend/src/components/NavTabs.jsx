import { useLocation, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import "./NavTabs.scss";

export function NavTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isTodo = location.pathname === "/my-todo";

  return (
    <div className="nav-tabs-header">
      <button
        className={`nav-tab-header ${isHome ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        {isHome && <motion.div className="tab-bg" layoutId="tab-bg" />}
        <span className="tab-label">HOME</span>
      </button>
      <button
        className={`nav-tab-header ${isTodo ? "active" : ""}`}
        onClick={() => navigate("/my-todo")}
      >
        {isTodo && <motion.div className="tab-bg" layoutId="tab-bg" />}
        <span className="tab-label">MY TODO</span>
      </button>
    </div>
  );
}
