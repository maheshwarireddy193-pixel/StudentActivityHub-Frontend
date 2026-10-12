
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  FileUp,
  Image,
  Info,
  LoaderCircle,
  Plus,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { API_BASE_URL } from "../../services/api";
import "../../App.css";

const initialForm = {
  title: "",
  category: "",
  organizer: "",
  date: "",
  description: "",
};

const categories = [
  "Technical",
  "Workshop",
  "Internship",
  "Hackathon",
  "Leadership",
  "Cultural",
  "Sports",
  "Volunteering",
  "Certification",
  "Other",
];

export default function SubmitActivity() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [certificate, setCertificate] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess(false);
  };

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, JPG, PNG, or WEBP file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Your certificate must be smaller than 5 MB.");
      return;
    }

    setCertificate(file);
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (
      !form.title.trim() ||
      !form.category ||
      !form.organizer.trim()
    ) {
      setError(
        "Please complete the activity title, category, and organizer."
      );
      return;
    }

    if (!form.date) {
      setError("Please select the activity date.");
      return;
    }

    if (!certificate) {
      setError("Please upload your certificate or supporting document.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again before submitting your activity.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", form.title.trim());
      data.append("description", form.description.trim());
      data.append("category", form.category);
      data.append("organizer", form.organizer.trim());
      data.append("date", form.date);
      data.append("certificate", certificate);

      const response = await fetch(
        `${API_BASE_URL}/activities/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        const message = await response.text();

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Authentication failed. Please log in again and try."
          );
        }

        throw new Error(
          message || `Activity submission failed (${response.status}).`
        );
      }

      // The backend has accepted and saved the activity.
      setSuccess(true);
      setForm(initialForm);
      setCertificate(null);
    } catch (err) {
      console.error("Activity submission error:", err);

      if (err instanceof TypeError) {
        setError(
          "Cannot connect to the backend. Check that the backend server is running and CORS is configured."
        );
      } else {
        setError(
          err.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="submit-page">
      <header className="submit-header">
        <Link to="/dashboard" className="submit-brand">
          <span className="submit-brand-mark">
            <BookOpen size={21} />
          </span>

          <span className="submit-brand-name">
            student<span>activity</span>
            <small>HUB</small>
          </span>
        </Link>

        <Link to="/dashboard" className="submit-back-link">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </header>

      <main className="submit-main">
        <div className="submit-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span>/</span>
          <strong>Submit activity</strong>
        </div>

        <section className="submit-intro">
          <div className="submit-eyebrow">
            <span />
            YOUR ACHIEVEMENTS MATTER
          </div>

          <h1>
            Add a new
            <br />
            <em>milestone.</em>
          </h1>

          <p>
            Every workshop, internship, competition, and certificate
            is part of your journey. Record yours here.
          </p>
        </section>

        <div className="submit-layout">
          <section className="submit-form-card">
            <div className="submit-card-heading">
              <div className="submit-heading-icon">
                <FileCheck2 size={21} />
              </div>

              <div>
                <h2>Activity details</h2>
                <p>Tell us about your achievement.</p>
              </div>

              <span className="submit-step">01 / 02</span>
            </div>

            <div className="submit-divider" />

            <form className="submit-form" onSubmit={handleSubmit}>
              <div className="submit-field">
                <label htmlFor="activity-title">
                  Activity title <span>*</span>
                </label>

                <input
                  id="activity-title"
                  name="title"
                  type="text"
                  placeholder="e.g. National Level Hackathon"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={120}
                  required
                />
              </div>

              <div className="submit-form-grid">
                <div className="submit-field">
                  <label htmlFor="activity-category">
                    Category <span>*</span>
                  </label>

                  <select
                    id="activity-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="submit-field">
                  <label htmlFor="activity-date">
                    Activity date <span>*</span>
                  </label>

                  <div className="submit-date-wrap">
                    <input
                      id="activity-date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      max={new Date().toISOString().slice(0, 10)}
                      required
                    />
                    <CalendarDays size={17} />
                  </div>
                </div>
              </div>

              <div className="submit-field">
                <label htmlFor="activity-organizer">
                  Organizer / Institution <span>*</span>
                </label>

                <input
                  id="activity-organizer"
                  name="organizer"
                  type="text"
                  placeholder="e.g. Google Cloud, Anurag University"
                  value={form.organizer}
                  onChange={handleChange}
                  maxLength={120}
                  required
                />
              </div>

              <div className="submit-field">
                <label htmlFor="activity-description">
                  Description{" "}
                  <span className="submit-optional">(optional)</span>
                </label>

                <textarea
                  id="activity-description"
                  name="description"
                  placeholder="Briefly describe what you participated in or achieved..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={1000}
                />

                <span className="submit-character-count">
                  {form.description.length}/1000 characters
                </span>
              </div>

              <div className="submit-divider" />

              <div className="submit-card-heading submit-upload-heading">
                <div className="submit-heading-icon">
                  <UploadCloud size={21} />
                </div>

                <div>
                  <h2>Supporting document</h2>
                  <p>Upload your certificate or proof of participation.</p>
                </div>

                <span className="submit-step">02 / 02</span>
              </div>

              <label
                className={`submit-dropzone ${
                  dragging ? "submit-dropzone-active" : ""
                } ${certificate ? "submit-dropzone-filled" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  handleFile(event.dataTransfer.files[0]);
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    handleFile(event.target.files[0]);
                    event.target.value = "";
                  }}
                  hidden
                />

                {certificate ? (
                  <span className="submit-file-preview">
                    <span className="submit-file-icon">
                      <FileCheck2 size={24} />
                    </span>

                    <span className="submit-file-info">
                      <strong>{certificate.name}</strong>
                      <small>
                        {formatFileSize(certificate.size)} · Ready to submit
                      </small>
                    </span>

                    <span className="submit-file-check">
                      <CheckCircle2 size={20} />
                    </span>
                  </span>
                ) : (
                  <>
                    <span className="submit-upload-icon">
                      <FileUp size={25} />
                    </span>

                    <strong>
                      Drop your certificate here, or{" "}
                      <span>browse files</span>
                    </strong>

                    <small>
                      PDF, JPG, PNG or WEBP · Maximum size 5 MB
                    </small>
                  </>
                )}
              </label>

              {certificate && (
                <button
                  type="button"
                  className="submit-remove-file"
                  onClick={() => setCertificate(null)}
                >
                  <X size={14} />
                  Remove file
                </button>
              )}

              <div className="submit-file-note">
                <Info size={15} />
                <span>
                  Make sure your uploaded document is readable and shows
                  the relevant achievement.
                </span>
              </div>

              {error && (
                <p className="submit-error" role="alert">
                  {error}
                </p>
              )}

              {success && (
                <div className="submit-success" role="status">
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>Activity submitted successfully!</strong>
                    <p>
                      Your activity has been saved. It is awaiting
                      verification.
                    </p>
                  </div>
                </div>
              )}

              <div className="submit-form-actions">
                <button
                  type="button"
                  className="submit-cancel"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="submit-spinner"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Submit activity
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="submit-side-panel">
            <div className="submit-side-top">
              <span className="submit-side-symbol">
                <ShieldCheck size={22} />
              </span>

              <span className="submit-side-label">
                YOUR ACHIEVEMENTS, SECURED
              </span>
            </div>

            <h2>
              Every little
              <br />
              thing <em>counts.</em>
            </h2>

            <p>
              Your extracurricular experiences help tell the complete
              story of who you are beyond the classroom.
            </p>

            <div className="submit-side-divider" />

            <div className="submit-tip">
              <span>01</span>
              <div>
                <strong>Be specific</strong>
                <p>Use the official name of your activity or event.</p>
              </div>
            </div>

            <div className="submit-tip">
              <span>02</span>
              <div>
                <strong>Add clear proof</strong>
                <p>Upload a readable certificate or supporting document.</p>
              </div>
            </div>

            <div className="submit-tip">
              <span>03</span>
              <div>
                <strong>Track your progress</strong>
                <p>Check your dashboard for activity updates.</p>
              </div>
            </div>

            <div className="submit-side-bottom">
              <Image size={17} />
              <span>Accepted documents: PDF and image files.</span>
            </div>
          </aside>
        </div>

        <footer className="submit-footer">
          <span>© 2026 Student Activity Hub</span>
          <span>One hub. Every milestone.</span>
        </footer>
      </main>
    </div>
  );
}
