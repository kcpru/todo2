import { useState } from "react";
import { z } from "zod";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { MdLogin, MdMailOutline, MdLockOutline } from "react-icons/md";
import "../styles/Auth.scss";
import { Input } from "../components/Input";
import { GradientButton } from "../components/GradientButton";
import { ANIMATION_CONFIG } from "../constants/animations";
import { useNotifications } from "../NotificationsContext";

export function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [shakeField, setShakeField] = useState(null);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotifications();

  const loginSchema = z.object({
    login: z.string().trim().min(1, "Required"),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters"),
  });

  const getFieldMotion = (field, delay) => {
    const base = ANIMATION_CONFIG.authFormGroup(delay);
    const isShaking = shakeField === field;

    if (isShaking) {
      return {
        initial: { opacity: 1, x: 0 },
        animate: { ...base.animate, ...ANIMATION_CONFIG.shake.animate },
        transition: { ...ANIMATION_CONFIG.shake.transition },
      };
    }

    return base;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse({
      login: usernameOrEmail,
      password,
    });

    if (!result.success) {
      const flat = result.error.flatten();
      const fieldErrors = Object.entries(flat.fieldErrors).reduce(
        (acc, [key, value]) => {
          if (value?.[0]) acc[key] = value[0];
          return acc;
        },
        {}
      );
      setValidationErrors(fieldErrors);
      const firstError = Object.keys(fieldErrors)[0];
      if (firstError) {
        notify({ type: "error", message: fieldErrors[firstError] });
        setShakeField(firstError);
        setTimeout(() => setShakeField(null), 400);
      }
      return;
    }

    setValidationErrors({});

    setIsLoading(true);
    const success = await login(usernameOrEmail, password);
    setIsLoading(false);

    if (success) {
      navigate("/");
    } else if (error) {
      notify({ type: "error", message: error });
    } else {
      notify({ type: "error", message: "Invalid credentials" });
    }
  };

  return (
    <div className="auth-container">
      <motion.div className="auth-card" {...ANIMATION_CONFIG.authCard}>
        <div className="auth-header">
          <motion.div className="auth-icon" {...ANIMATION_CONFIG.authIcon}>
            <MdLogin />
          </motion.div>
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Sign in to your todo chaos</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <motion.div
            className={`form-group ${
              validationErrors.login
                ? "invalid"
                : usernameOrEmail.trim()
                ? "valid"
                : ""
            }`}
            {...getFieldMotion("login", 0.2)}
          >
            <label htmlFor="login">
              <MdMailOutline className="form-icon" /> Username or Email
            </label>
            <Input
              id="login"
              type="text"
              value={usernameOrEmail}
              onChange={(e) => {
                const value = e.target.value;
                setUsernameOrEmail(value);
                if (validationErrors.login && value.trim()) {
                  setValidationErrors((prev) => {
                    const { login, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="your@email.com"
              withRipple
              disabled={isLoading}
              required
            />
          </motion.div>

          <motion.div
            className={`form-group ${
              validationErrors.password
                ? "invalid"
                : password.trim().length >= 8
                ? "valid"
                : ""
            }`}
            {...getFieldMotion("password", 0.3)}
          >
            <label htmlFor="password">
              <MdLockOutline className="form-icon" /> Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                if (validationErrors.password && value.trim().length >= 8) {
                  setValidationErrors((prev) => {
                    const { password: pw, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="••••••••"
              withRipple
              disabled={isLoading}
              required
            />
          </motion.div>

          {/* Removed inline auth-error; errors are now shown via NotificationCenter */}

          <motion.div {...ANIMATION_CONFIG.authButton(0.4)}>
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

        <motion.p className="auth-link" {...ANIMATION_CONFIG.authButton(0.5)}>
          New to chaos? <Link to="/register">Create an account</Link>
        </motion.p>

        <motion.div
          className="auth-benefits"
          {...ANIMATION_CONFIG.authButton(0.6)}
        >
          <p>✨ Track your chaos</p>
          <p>🎯 Stay focused and productive</p>
          <p>⚡ Build habits</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
