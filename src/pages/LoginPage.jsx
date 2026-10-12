import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { loginUser } from "../services/authService";
import "../App.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: email.trim(),
        password,
      });

      if (!data.token || !data.role) {
        setError(
          "Login response is missing the authentication token or user role."
        );
        return;
      }

      // Store authentication details
      const role = String(data.role).replace(/^ROLE_/, "").toUpperCase();

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);

      setSuccess("Login successful!");

      // Redirect based on the user's role
      if (role === "FACULTY") {
        navigate("/faculty-dashboard", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else if (role === "STUDENT") {
        navigate("/dashboard", { replace: true });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setError("Your account has an unrecognized role.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <BookOpen size={21} strokeWidth={1.8} />
          </span>

          <span className="brand-name">
            student<span className="brand-light">activity</span>
            <span className="brand-hub">HUB</span>
          </span>
        </Link>

        <Link to="/" className="auth-back-link">
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </header>

      <main className="auth-main">
        <section className="auth-form-section">
          <div className="auth-form-wrap">
            <div className="auth-eyebrow">
              <span className="eyebrow-line" />
              YOUR CAMPUS, ORGANIZED
            </div>

            <h1 className="auth-title">
              Welcome
              <br />
              <em>back.</em>
            </h1>

            <p className="auth-description">
              Sign in to manage your activities, track your achievements,
              and keep everything in one place.
            </p>

            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-field">
                <label className="form-label" htmlFor="email">
                  Email address
                </label>

                <div className="auth-input-wrap">
                  <Mail size={17} />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                </div>

                <div className="auth-input-wrap">
                  <LockKeyhole size={17} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}

              {success && (
                <p className="auth-success" role="status">
                  {success}
                </p>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in to your account"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="auth-switch">
              New to Student Activity Hub?{" "}
              <Link to="/register">Create an account</Link>
            </p>

            <div className="auth-security">
              <ShieldCheck size={16} />
              <span>Your account and activities stay protected.</span>
            </div>
          </div>
        </section>

        <aside className="auth-visual">
          <div className="auth-visual-content">
            <span className="auth-visual-label">
              <span className="visual-label-dot" />
              MORE THAN A CHECKLIST
            </span>

            <h2>
              Every achievement
              <br />
              <em>has a place.</em>
            </h2>

            <p>
              Bring your certificates, campus activities, and accomplishments
              together in one organized space.
            </p>

            <div className="auth-visual-footer">
              <span>ONE HUB. EVERY MILESTONE.</span>
              <span>EST. FOR STUDENTS</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}