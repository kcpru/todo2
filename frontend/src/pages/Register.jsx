import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  MdPersonAdd,
  MdMailOutline,
  MdLockOutline,
  MdCheckCircleOutline,
} from "react-icons/md";
import "../styles/Auth.scss";
import { Input } from "../components/Input";
import { GradientButton } from "../components/GradientButton";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (password !== passwordConfirm) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const success = await register(username, email, password);
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
            <MdPersonAdd />
          </motion.div>
          <h1 className="auth-title">Join the Revolution!</h1>
          <p className="auth-subtitle">Your dopamine dispenser awaits</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label htmlFor="username">
              <MdPersonAdd className="form-icon" /> Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_awesome_name"
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
            <label htmlFor="email">
              <MdMailOutline className="form-icon" /> Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            transition={{ duration: 0.5, delay: 0.4 }}
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

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label htmlFor="passwordConfirm">
              <MdCheckCircleOutline className="form-icon" /> Confirm Password
            </label>
            <Input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm password"
              withRipple
              disabled={isLoading}
              required
            />
          </motion.div>

          {(validationError || error) && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {validationError || error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GradientButton
              type="submit"
              className="auth-button"
              disabled={isLoading}
              size="md"
              icon={<MdPersonAdd />}
              variant="success"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </GradientButton>
          </motion.div>
        </form>

        <motion.p
          className="auth-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Already have an account? <Link to="/login">Sign in here</Link>
        </motion.p>

        <motion.div
          className="auth-benefits"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p>🚀 Start crushing tasks</p>
          <p>💰 Earn coins for wins</p>
          <p>🎮 Level up your productivity</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
