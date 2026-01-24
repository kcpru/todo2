import { motion } from "motion/react";
import { useState } from "react";
import {
  MdPersonAdd,
  MdMailOutline,
  MdLockOutline,
  MdCheckCircleOutline,
} from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ANIMATION_CONFIG } from "@constants/animations";
import { useAuth } from "@context/AuthContext";
import { useNotifications } from "@context/NotificationsContext";

import "./Auth.scss";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [shakeField, setShakeField] = useState(null);
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotifications();

  const registerSchema = z
    .object({
      username: z.string().trim().min(3, "Username too short"),
      email: z.string().trim().email("Invalid email"),
      password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters"),
      passwordConfirm: z.string().trim().min(1, "Required"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
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
    const result = registerSchema.safeParse({
      username,
      email,
      password,
      passwordConfirm,
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
        notify({
          type: "error",
          message: fieldErrors[firstError] || "Please check the fields",
        });
        setShakeField(firstError);
        setTimeout(() => setShakeField(null), 400);
      }
      return;
    }

    setValidationErrors({});

    setIsLoading(true);
    const success = await register(username, email, password);
    setIsLoading(false);

    if (success) {
      navigate("/");
    } else if (error) {
      notify({ type: "error", message: error });
    } else {
      notify({ type: "error", message: "Registration failed" });
    }
  };

  return (
    <div className="auth-container">
      <motion.div className="auth-card" {...ANIMATION_CONFIG.authCard}>
        <div className="auth-header">
          <motion.div className="auth-icon" {...ANIMATION_CONFIG.authIcon}>
            <MdPersonAdd />
          </motion.div>
          <h1 className="auth-title">Join the Revolution!</h1>
          <p className="auth-subtitle">Join and start organizing tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <motion.div
            className={`form-group ${
              validationErrors.username
                ? "invalid"
                : username.trim().length >= 3
                  ? "valid"
                  : ""
            }`}
            {...getFieldMotion("username", 0.2)}
          >
            <label htmlFor="username">
              <MdPersonAdd className="form-icon" /> Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                const value = e.target.value;
                setUsername(value);
                if (validationErrors.username && value.trim().length >= 3) {
                  setValidationErrors((prev) => {
                    const { username: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="your_awesome_name"
              withRipple
              disabled={isLoading}
              required
            />
          </motion.div>

          <motion.div
            className={`form-group ${
              validationErrors.email ? "invalid" : email.trim() ? "valid" : ""
            }`}
            {...getFieldMotion("email", 0.3)}
          >
            <label htmlFor="email">
              <MdMailOutline className="form-icon" /> Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                if (validationErrors.email && value.trim()) {
                  const isValidEmail = z
                    .string()
                    .email()
                    .safeParse(value.trim()).success;
                  if (isValidEmail) {
                    setValidationErrors((prev) => {
                      const { email: _, ...rest } = prev;
                      return rest;
                    });
                  }
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
                : password.trim().length >= 6
                  ? "valid"
                  : ""
            }`}
            {...getFieldMotion("password", 0.4)}
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
                if (validationErrors.password && value.trim().length >= 6) {
                  setValidationErrors((prev) => {
                    const { password: _, ...rest } = prev;
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

          <motion.div
            className={`form-group ${
              validationErrors.passwordConfirm
                ? "invalid"
                : passwordConfirm.trim() && passwordConfirm === password
                  ? "valid"
                  : ""
            }`}
            {...getFieldMotion("passwordConfirm", 0.5)}
          >
            <label htmlFor="passwordConfirm">
              <MdCheckCircleOutline className="form-icon" /> Confirm Password
            </label>
            <Input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                const value = e.target.value;
                setPasswordConfirm(value);
                if (
                  validationErrors.passwordConfirm &&
                  value.trim() &&
                  value.trim() === password.trim()
                ) {
                  setValidationErrors((prev) => {
                    const { passwordConfirm: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="Confirm password"
              withRipple
              disabled={isLoading}
              required
            />
          </motion.div>

          {/* Removed inline auth-error; errors are now shown via NotificationCenter */}

          <motion.div {...ANIMATION_CONFIG.authButton(0.6)}>
            <Button
              type="submit"
              className="auth-button"
              disabled={isLoading}
              size="md"
              icon={<MdPersonAdd />}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </motion.div>
        </form>

        <motion.p className="auth-link" {...ANIMATION_CONFIG.authButton(0.7)}>
          Already have an account? <Link to="/login">Sign in here</Link>
        </motion.p>

        <motion.div
          className="auth-benefits"
          {...ANIMATION_CONFIG.authButton(0.8)}
        >
          <p>🚀 Start crushing tasks</p>
          <p>🧭 Build momentum with habits</p>
          <p>🎮 Level up your productivity</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
