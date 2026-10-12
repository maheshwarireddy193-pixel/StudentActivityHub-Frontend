import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import "../App.css";

export default function Settings() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Your new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Your new password must be different from your current password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setMessage(
        response.data?.message || "Password changed successfully!"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to change your password. Please check your current password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  const passwordField = (
    label,
    value,
    setValue,
    visible,
    setVisible,
    placeholder
  ) => (
    <div className="settings-field">
      <label>{label}</label>

      <div className="settings-input-wrapper">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />

        <button
          type="button"
          className="settings-eye-button"
          onClick={() => setVisible((previous) => !previous)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <style>{`
        .settings-page {
          min-height: 100vh;
          width: 100%;
          padding: 0;
          background: #f7f6f0;
          color: #244b3c;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }

        .settings-page *,
        .settings-page *::before,
        .settings-page *::after {
          box-sizing: border-box;
        }

        .settings-topbar {
          width: 100%;
          min-height: 76px;
          padding: 16px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: #fffefa;
          border-bottom: 1px solid #e5e7dd;
        }

        .settings-back {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 0;
          border: none;
          background: transparent;
          color: #59665a;
          font: inherit;
          font-size: 13px;
          cursor: pointer;
        }

        .settings-back:hover {
          color: #244b3c;
        }

        .settings-brand {
          color: #244b3c;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .settings-brand span {
          color: #82947a;
        }

        .settings-container {
          width: min(760px, calc(100% - 40px));
          margin: 0 auto;
          padding: 55px 0 45px;
        }

        .settings-heading {
          margin-bottom: 30px;
        }

        .settings-eyebrow {
          color: #788b70;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .settings-heading h1 {
          margin: 12px 0 8px;
          color: #244b3c;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(36px, 5vw, 48px);
          line-height: 1.2;
          font-weight: 500;
        }

        .settings-heading p {
          margin: 0;
          color: #74796f;
          font-size: 14px;
          line-height: 1.8;
        }

        .settings-card {
          width: 100%;
          margin-bottom: 24px;
          padding: 30px;
          background: #fffefa;
          border: 1px solid #e4e7dc;
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(36, 75, 60, 0.05);
        }

        .settings-card-heading {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 28px;
        }

        .settings-card-icon {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          color: #315b47;
          background: #eaf0e6;
          border-radius: 8px;
        }

        .settings-card-heading h2 {
          margin: 2px 0 7px;
          color: #294b3d;
          font-size: 18px;
          font-weight: 600;
        }

        .settings-card-heading p {
          margin: 0;
          color: #74796f;
          font-size: 13px;
          line-height: 1.7;
        }

        .settings-field {
          width: 100%;
          margin-bottom: 22px;
        }

        .settings-field label {
          display: block;
          margin-bottom: 9px;
          color: #454f45;
          font-size: 13px;
          font-weight: 600;
        }

        .settings-input-wrapper {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          border: 1px solid #dedfd5;
          border-radius: 6px;
          background: #fff;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .settings-input-wrapper:focus-within {
          border-color: #66856b;
          box-shadow: 0 0 0 3px rgba(102, 133, 107, 0.1);
        }

        .settings-input-wrapper input {
          flex: 1;
          width: 0;
          min-width: 0;
          min-height: 46px;
          padding: 12px 14px;
          border: none;
          outline: none;
          background: transparent;
          color: #303c32;
          font-family: inherit;
          font-size: 13px;
        }

        .settings-input-wrapper input::placeholder {
          color: #a1a49b;
        }

        .settings-eye-button {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          padding: 0;
          border: none;
          background: transparent;
          color: #777f72;
          cursor: pointer;
        }

        .settings-eye-button:hover {
          background: #f1f3eb;
          color: #244b3c;
        }

        .settings-password-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 5px 0 24px;
          color: #78836f;
          font-size: 12px;
        }

        .settings-save-button,
        .settings-logout-button {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 20px;
          border-radius: 6px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .settings-save-button {
          border: none;
          background: #294f3e;
          color: #fff;
        }

        .settings-save-button:hover:not(:disabled) {
          background: #456c52;
          transform: translateY(-1px);
        }

        .settings-save-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .settings-message {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 22px;
          padding: 12px 14px;
          border-radius: 6px;
          font-size: 12px;
          line-height: 1.6;
        }

        .settings-message svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .settings-success {
          border: 1px solid #d2e5d1;
          background: #f0f7ed;
          color: #326444;
        }

        .settings-error {
          border: 1px solid #efd3ce;
          background: #fff4f1;
          color: #a13f35;
        }

        .settings-logout-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .settings-logout-card .settings-card-heading {
          margin-bottom: 0;
        }

        .settings-logout-button {
          flex-shrink: 0;
          border: 1px solid #eedbd5;
          background: #f8eeeb;
          color: #a3483d;
        }

        .settings-logout-button:hover {
          background: #f3dfda;
        }

        .settings-footer {
          margin-top: 30px;
          color: #92968c;
          font-size: 11px;
          text-align: center;
        }

        @media (max-width: 600px) {
          .settings-topbar {
            padding: 14px 5%;
          }

          .settings-brand {
            font-size: 14px;
          }

          .settings-container {
            width: calc(100% - 28px);
            padding-top: 35px;
          }

          .settings-card {
            padding: 22px 18px;
          }

          .settings-logout-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .settings-logout-card .settings-card-heading {
            margin-bottom: 4px;
          }
        }
      `}</style>

      <header className="settings-topbar">
        <button
          type="button"
          className="settings-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        <span className="settings-brand">
          Student<span>Activity</span>Hub
        </span>
      </header>

      <main className="settings-container">
        <div className="settings-heading">
          <span className="settings-eyebrow">ACCOUNT PREFERENCES</span>
          <h1>Settings</h1>
          <p>Manage your account security and preferences.</p>
        </div>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <LockKeyhole size={21} />
            </div>

            <div>
              <h2>Change password</h2>
              <p>
                Keep your account secure by using a strong password.
              </p>
            </div>
          </div>

          {message && (
            <div className="settings-message settings-success" role="status">
              <CheckCircle2 size={18} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="settings-message settings-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            {passwordField(
              "Current password",
              currentPassword,
              setCurrentPassword,
              showCurrent,
              setShowCurrent,
              "Enter your current password"
            )}

            {passwordField(
              "New password",
              newPassword,
              setNewPassword,
              showNew,
              setShowNew,
              "Enter your new password"
            )}

            {passwordField(
              "Confirm new password",
              confirmPassword,
              setConfirmPassword,
              showConfirm,
              setShowConfirm,
              "Re-enter your new password"
            )}

            <div className="settings-password-hint">
              <ShieldCheck size={16} />
              <span>Use at least 8 characters for your new password.</span>
            </div>

            <button
              type="submit"
              className="settings-save-button"
              disabled={loading}
            >
              {loading ? "Updating password..." : "Update password"}
            </button>
          </form>
        </section>

        <section className="settings-card settings-logout-card">
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <LogOut size={21} />
            </div>

            <div>
              <h2>Sign out</h2>
              <p>Sign out of your StudentActivityHub account.</p>
            </div>
          </div>

          <button
            type="button"
            className="settings-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Log out
          </button>
        </section>

        <p className="settings-footer">
          StudentActivityHub · Every achievement has a story.
        </p>
      </main>
    </div>
  );
}