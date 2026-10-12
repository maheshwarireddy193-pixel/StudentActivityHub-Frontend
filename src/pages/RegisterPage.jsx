
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  UserRound,
  Mail,
  LockKeyhole,
  GraduationCap,
} from "lucide-react";
import { registerUser } from "../services/authService";
import "../App.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (!data.token) {
        setError("Registration succeeded, but no token was returned.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setSuccess(data.message || "Registration successful!");

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Check the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <BookOpen size={21} />
          </span>
          <span className="brand-name">
            student<span className="brand-light">activity</span>
            <span className="brand-hub">HUB</span>
          </span>
        </Link>

        <Link to="/" className="auth-back-link">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>

      <main className="auth-main register-main">
        <section className="auth-form-section register-form-section">
          <div className="auth-form-wrap register-form-wrap">
            <span className="section-label">YOUR JOURNEY STARTS HERE</span>

            <h1 className="auth-title">
              Make room
              <br />
              for <em>your story.</em>
            </h1>

            <p className="auth-description">
              Create your account and bring your college achievements
              together in one place.
            </p>

            <form
              className="auth-form register-form"
              onSubmit={handleRegister}
            >
              <div className="form-field">
                <label htmlFor="name">Full name</label>
                <div className="auth-input-wrap">
                  <UserRound size={18} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="email">College email</label>
                <div className="auth-input-wrap">
                  <Mail size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@college.edu"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Account type</label>
                <div className="auth-input-wrap register-role">
                  <GraduationCap size={18} />
                  <span>Student</span>
                  <span className="role-badge">STUDENT</span>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="auth-error" role="alert">{error}</p>
              )}

              {success && (
                <p className="auth-success" role="status">{success}</p>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?
              <Link to="/login"> Sign in</Link>
            </p>
          </div>
        </section>

        <aside className="auth-visual register-visual">
          <div className="auth-visual-content">
            <span className="auth-visual-label">
              EVERY ACHIEVEMENT COUNTS
            </span>

            <h2>
              Start with today.
              <br />
              Build towards <em>tomorrow.</em>
            </h2>

            <p>
              From your first workshop to your biggest project,
              keep every experience ready for your next opportunity.
            </p>

            <div className="register-benefits">
              <div>
                <span>01</span>
                <p>Organize your college activities</p>
              </div>
              <div>
                <span>02</span>
                <p>Track certificate verification</p>
              </div>
              <div>
                <span>03</span>
                <p>Build your professional resume</p>
              </div>
            </div>
          </div>

          <span className="auth-visual-footer">
            STUDENT ACTIVITY HUB · YOUR JOURNEY, DOCUMENTED
          </span>
        </aside>
      </main>
    </div>
  );
}


