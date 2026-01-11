import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { MdLogin, MdMailOutline, MdLockOutline } from "react-icons/md";
import "../styles/Auth.scss";
import { Input } from "../components/Input";
import { GradientButton } from "../components/GradientButton";

export function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(usernameOrEmail, password);
    setIsLoading(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <motion.div
            className="auth-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <MdLogin />
          </motion.div>
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Sign in to your todo chaos</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label htmlFor="login">
              <MdMailOutline className="form-icon" /> Username or Email
            </label>
            <Input
              id="login"
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="your@email.com"
              withRipple
              disabled={isLoading}
              required
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label htmlFor="password">
              <MdLockOutline className="form-icon" /> Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              withRipple
              disabled={isLoading}
              required
            />
          </motion.div>

          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GradientButton
              type="submit"
              className="auth-button"
              disabled={isLoading}
              size="md"
              icon={<MdLogin />}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </GradientButton>
          </motion.div>
        </form>

        <motion.p
          className="auth-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          New to chaos? <Link to="/register">Create an account</Link>
        </motion.p>

        <motion.div
          className="auth-benefits"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p>✨ Track your chaos</p>
          <p>🎯 Get dopamine rewards</p>
          <p>⚡ Build habits</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
