import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  RefreshCw,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Eye,
  Download,
  UserRound,
  Mail,
  GraduationCap,
  CalendarDays,
  LoaderCircle,
  ExternalLink,
  Code,
  Globe,
  FolderKanban,
  Search,
} from "lucide-react";

import api from "../../services/api";
import "../../App.css";

const EMPTY_STATS = {
  totalSubmissions: 0,
  pending: 0,
  verified: 0,
  rejected: 0,
};

function formatDate(dateValue) {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeStatus(status) {
  return String(status || "PENDING").toUpperCase();
}

function getCertificateUrl(filename) {
  if (!filename) return null;

  // The backend should expose this secure endpoint.
  return `/faculty/certificates/${encodeURIComponent(filename)}`;
}

export default function FacultyDashboard() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [studentReports, setStudentReports] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState("");
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [remarks, setRemarks] = useState({});
  const [filter, setFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [activitiesResponse, statsResponse, reportResponse] = await Promise.all([
        api.get("/faculty/activities"),
        api.get("/faculty/stats"),
        api.get("/faculty/student-submission-report"),
      ]);

      const activityData = activitiesResponse.data;
      const statsData = statsResponse.data;
      const reportData = reportResponse.data;

      if (!Array.isArray(activityData)) {
        throw new Error("The server returned an unexpected activities response.");
      }

      setActivities(activityData);
      setStudentReports(Array.isArray(reportData) ? reportData : []);

      setStats({
        totalSubmissions: Number(statsData?.totalSubmissions ?? activityData.length),
        pending: Number(statsData?.pending ?? 0),
        verified: Number(statsData?.verified ?? 0),
        rejected: Number(statsData?.rejected ?? 0),
      });
    } catch (err) {
      console.error("Faculty dashboard loading error:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(
          "Access denied. Please sign in with an authorized faculty account."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Unable to load submissions. Check whether the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPortfolios = useCallback(async () => {
    setPortfolioLoading(true);
    setPortfolioError("");
    try {
      const response = await api.get("/faculty/portfolios");
      setPortfolios(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Student portfolios loading error:", err);
      setPortfolioError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load student portfolios. Please check the backend."
      );
    } finally {
      setPortfolioLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    loadPortfolios();
  }, [loadDashboard, loadPortfolios]);

  const filteredPortfolios = portfolios.filter((student) => {
    const query = portfolioSearch.trim().toLowerCase();
    if (!query) return true;
    return [student.name, student.email, student.rollNumber]
      .some((value) => String(value || "").toLowerCase().includes(query));
  });

  const handleReview = async (activity, status) => {
    const activityId = activity.id;
    const activityRemarks = (remarks[activityId] || "").trim();

    if (status === "REJECTED" && !activityRemarks) {
      setError("Please enter a reason before rejecting this certificate.");
      return;
    }

    const action = status === "VERIFIED" ? "verify" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${action} "${activity.title}"?`
      )
    ) {
      return;
    }

    setReviewingId(activityId);
    setError("");
    setSuccess("");

    try {
      await api.put("/faculty/verify", {
        activityId,
        status,
        remarks: activityRemarks,
      });

      setSuccess(
        status === "VERIFIED"
          ? "Certificate verified successfully."
          : "Certificate rejected successfully."
      );

      await loadDashboard();
    } catch (err) {
      console.error("Certificate review error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update this certificate."
      );
    } finally {
      setReviewingId(null);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  const filteredActivities = activities.filter((activity) => {
    if (filter === "ALL") return true;
    return normalizeStatus(activity.status) === filter;
  });

  const openCertificate = (filename) => {
    if (!filename) {
      setError("No certificate file is available for this submission.");
      return;
    }

    const url = getCertificateUrl(filename);

    // Uses the configured Axios base URL and authentication interceptor.
    api
      .get(url, { responseType: "blob" })
      .then((response) => {
        const objectUrl = URL.createObjectURL(response.data);
        window.open(objectUrl, "_blank", "noopener,noreferrer");

        // Keep the URL alive briefly for the new tab to load.
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      })
      .catch((err) => {
        console.error("Certificate opening error:", err);
        setError(
          "Unable to open this certificate. The secure certificate endpoint must be implemented in the backend."
        );
      });
  };

  const downloadCertificate = async (filename, activityId) => {
    if (!filename) {
      setError("No certificate file is available for this submission.");
      return;
    }

    try {
      const response = await api.get(getCertificateUrl(filename), {
        responseType: "blob",
      });

      const objectUrl = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = `certificate-${activityId}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Certificate download error:", err);
      setError(
        "Unable to download the certificate. Check the backend certificate endpoint."
      );
    }
  };

  const statCards = [
    {
      label: "Pending Reviews",
      value: stats.pending,
      icon: Clock,
    },
    {
      label: "Verified",
      value: stats.verified,
      icon: CheckCircle2,
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
    },
    {
      label: "Total Submissions",
      value: stats.totalSubmissions,
      icon: FileCheck2,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f6f0",
        color: "#243c32",
        padding: "28px clamp(18px, 3vw, 48px)",
        fontFamily: "'DM Sans', sans-serif",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 25,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            <ShieldCheck size={36} />
            <span>Student Activity Hub</span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 4vw, 54px)",
              margin: "0 0 12px",
            }}
          >
            Faculty Dashboard
          </h1>

          <p style={{ color: "#718078", fontSize: 17, margin: 0 }}>
            Review student achievements and manage certificate verification.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            style={secondaryButton}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            style={primaryButton}
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.label} style={statCardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#718078",
                  gap: 10,
                }}
              >
                <span>{card.label}</span>
                <Icon size={27} />
              </div>

              <div
                style={{
                  fontSize: 43,
                  fontWeight: 700,
                  marginTop: 24,
                }}
              >
                {card.value}
              </div>
            </article>
          );
        })}
      </section>

      <section style={{ ...panelStyle, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: 29 }}>Student Portfolio Directory</h2>
            <p style={{ margin: 0, color: "#718078", lineHeight: 1.6 }}>Explore student profiles, coding links, and projects in one place.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #dfe4da", borderRadius: 12, padding: "0 13px", background: "#fff", minWidth: 220 }}>
            <Search size={18} color="#718078" />
            <input value={portfolioSearch} onChange={(e) => setPortfolioSearch(e.target.value)} placeholder="Search name, email, roll no." aria-label="Search student portfolios" style={{ border: "none", outline: "none", padding: "13px 0", width: "100%", font: "inherit", background: "transparent" }} />
          </div>
        </div>

        {portfolioLoading ? (
          <div style={emptyStateStyle}><LoaderCircle size={28} /><p>Loading student portfolios...</p></div>
        ) : portfolioError ? (
          <div role="alert" style={errorStyle}>{portfolioError} <button type="button" onClick={loadPortfolios} style={{ ...secondaryButton, marginLeft: 10 }}>Try again</button></div>
        ) : filteredPortfolios.length === 0 ? (
          <div style={emptyStateStyle}><FolderKanban size={36} /><h3>No student portfolios found</h3><p>Students and their saved project details will appear here.</p></div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {filteredPortfolios.map((student) => {
              const isExpanded = expandedStudentId === student.studentId;
              const links = [
                { label: "GitHub", url: student.githubUrl, icon: Code },
                { label: "LinkedIn", url: student.linkedinUrl, icon: UserRound },
                { label: "LeetCode", url: student.leetcodeUrl, icon: Code },
                { label: "Portfolio", url: student.portfolioUrl, icon: Globe },
              ].filter((link) => link.url);
              const projects = Array.isArray(student.projects) ? student.projects : [];
              return (
                <article key={student.studentId} style={{ border: "1px solid #e4e8df", borderRadius: 18, padding: 21, background: "#fff", minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 13, alignItems: "center", marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 15, background: "#e5eee4", color: "#2e5a42", display: "grid", placeItems: "center", flexShrink: 0 }}><UserRound size={24} /></div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ margin: "0 0 5px", fontSize: 19, overflowWrap: "anywhere" }}>{student.name || "Student"}</h3>
                      <div style={{ color: "#718078", fontSize: 13, overflowWrap: "anywhere" }}>{student.rollNumber || "Roll number not added"}</div>
                    </div>
                  </div>
                  <div style={{ color: "#65766e", fontSize: 14, overflowWrap: "anywhere", marginBottom: 14 }}><Mail size={15} style={{ verticalAlign: "middle", marginRight: 7 }} />{student.email || "Email unavailable"}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {links.length ? links.map(({ label, url, icon: Icon }) => (
                      <a key={label} href={url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 9, background: "#f0f4ee", color: "#2e5a42", textDecoration: "none", fontSize: 13, fontWeight: 600 }}><Icon size={15} />{label}<ExternalLink size={12} /></a>
                    )) : <span style={{ color: "#8a958d", fontSize: 13 }}>No professional links added yet.</span>}
                  </div>
                  <button type="button" onClick={() => setExpandedStudentId(isExpanded ? null : student.studentId)} style={{ ...secondaryButton, width: "100%", padding: "11px 14px", fontSize: 14 }}>
                    <FolderKanban size={17} /> {isExpanded ? "Hide projects" : `View projects (${projects.length})`}
                  </button>
                  {isExpanded && (
                    <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                      {projects.length === 0 ? <p style={{ color: "#718078", fontSize: 14, margin: 0 }}>No projects added yet.</p> : projects.map((project) => (
                        <div key={project.id} style={{ borderTop: "1px solid #edf0e9", paddingTop: 13 }}>
                          <h4 style={{ margin: "0 0 6px", fontSize: 16 }}>{project.title || "Untitled project"}</h4>
                          {project.description && <p style={{ margin: "0 0 8px", color: "#718078", fontSize: 13, lineHeight: 1.5 }}>{project.description}</p>}
                          {project.technologies && <div style={{ color: "#4f6c59", fontSize: 12, marginBottom: 8 }}>Tech: {project.technologies}</div>}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 13 }}>
                            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ color: "#2e5a42", display: "inline-flex", alignItems: "center", gap: 5 }}><Code size={14} /> GitHub <ExternalLink size={12} /></a>}
                            {project.liveDemoUrl && <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" style={{ color: "#2e5a42", display: "inline-flex", alignItems: "center", gap: 5 }}><Globe size={14} /> Live demo <ExternalLink size={12} /></a>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ ...panelStyle, marginBottom: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 29 }}>
            Student-wise Submission Report
          </h2>
          <p style={{ margin: 0, color: "#718078", fontSize: 16, lineHeight: 1.6 }}>
            See how many activities each student has submitted and track their review status.
          </p>
        </div>

        {loading ? (
          <div style={emptyStateStyle}>
            <LoaderCircle size={28} />
            <p>Loading student report...</p>
          </div>
        ) : studentReports.length === 0 ? (
          <div style={emptyStateStyle}>
            <GraduationCap size={36} />
            <h3>No student submissions yet</h3>
            <p>Student-wise counts will appear here after activities are submitted.</p>
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: "100%" }}>
            <table
              style={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <colgroup>
                <col style={{ width: "32%" }} />
                <col style={{ width: "21%" }} />
                <col style={{ width: "11.75%" }} />
                <col style={{ width: "11.75%" }} />
                <col style={{ width: "11.75%" }} />
                <col style={{ width: "11.75%" }} />
              </colgroup>
              <thead>
                <tr style={{ background: "#f4f5ef", textAlign: "left" }}>
                  {["Student", "Roll Number", "Total", "Pending", "Verified", "Rejected"].map((heading) => (
                    <th key={heading} style={reportHeaderCellStyle}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentReports.map((student) => (
                  <tr key={student.studentId ?? student.studentEmail ?? student.rollNumber}>
                    <td style={reportCellStyle}>
                      <div style={{ fontWeight: 700, overflowWrap: "anywhere" }}>{student.studentName || "Name unavailable"}</div>
                      <div style={{ color: "#718078", fontSize: 12, marginTop: 4, overflowWrap: "anywhere" }}>
                        {student.studentEmail || "Email unavailable"}
                      </div>
                    </td>
                    <td style={{ ...reportCellStyle, overflowWrap: "anywhere" }}>{student.rollNumber || "Not entered"}</td>
                    <td style={{ ...reportCellStyle, textAlign: "center" }}><span style={countBadgeStyle}>{Number(student.totalSubmissions ?? 0)}</span></td>
                    <td style={{ ...reportCellStyle, textAlign: "center" }}><span style={{ ...countBadgeStyle, background: "#fff2d9", color: "#946313" }}>{Number(student.pending ?? 0)}</span></td>
                    <td style={{ ...reportCellStyle, textAlign: "center" }}><span style={{ ...countBadgeStyle, background: "#e0f2e5", color: "#24663c" }}>{Number(student.verified ?? 0)}</span></td>
                    <td style={{ ...reportCellStyle, textAlign: "center" }}><span style={{ ...countBadgeStyle, background: "#fde7e3", color: "#a33126" }}>{Number(student.rejected ?? 0)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 18,
            marginBottom: 28,
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 10px", fontSize: 29 }}>
              Certificate Submissions
            </h2>

            <p style={{ margin: 0, color: "#718078", fontSize: 17 }}>
              Identify students, inspect certificates, and review submissions.
            </p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={selectStyle}
            aria-label="Filter certificate submissions"
          >
            <option value="PENDING">Pending only</option>
            <option value="VERIFIED">Verified only</option>
            <option value="REJECTED">Rejected only</option>
            <option value="ALL">All submissions</option>
          </select>
        </div>

        {error && (
          <div role="alert" style={errorStyle}>
            {error}
          </div>
        )}

        {success && (
          <div role="status" style={successStyle}>
            {success}
          </div>
        )}

        {loading ? (
          <div style={emptyStateStyle}>
            <LoaderCircle size={30} />
            <p>Loading submissions...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div style={emptyStateStyle}>
            <FileCheck2 size={38} />
            <h3>No submissions found</h3>
            <p>There are no activities matching this filter.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 22 }}>
            {filteredActivities.map((activity) => {
              const status = normalizeStatus(activity.status);
              const isPending = status === "PENDING";
              const isReviewing = reviewingId === activity.id;
              const certificateFilename = activity.certificateUrl;

              return (
                <article key={activity.id} style={submissionCardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 14,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 12,
                        }}
                      >
                        <h3 style={{ margin: 0, fontSize: 24 }}>
                          {activity.title || "Untitled activity"}
                        </h3>

                        <span style={statusStyle(status)}>{status}</span>
                      </div>

                      <p
                        style={{
                          color: "#65766e",
                          fontSize: 17,
                          lineHeight: 1.7,
                          margin: "14px 0",
                        }}
                      >
                        {activity.description || "No description provided."}
                      </p>
                    </div>

                    <span style={{ color: "#718078" }}>
                      ID: {activity.id}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 14,
                      background: "#f8f8f3",
                      borderRadius: 12,
                      padding: 18,
                      marginTop: 14,
                    }}
                  >
                    <InfoItem
                      icon={UserRound}
                      label="Student name"
                      value={activity.studentName || "Not available"}
                    />

                    <InfoItem
                      icon={GraduationCap}
                      label="Roll number"
                      value={
                        activity.studentRollNumber ||
                        "Not entered yet"
                      }
                    />

                    <InfoItem
                      icon={Mail}
                      label="Student email"
                      value={activity.studentEmail || "Not available"}
                    />

                    <InfoItem
                      icon={CalendarDays}
                      label="Submitted"
                      value={formatDate(activity.createdAt)}
                    />

                    <InfoItem
                      icon={FileCheck2}
                      label="Category"
                      value={activity.category || "Not specified"}
                    />

                    {activity.organizer && (
                      <InfoItem
                        icon={ExternalLink}
                        label="Organizer"
                        value={activity.organizer}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      marginTop: 18,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCertificate(certificateFilename)
                      }
                      disabled={!certificateFilename}
                      style={secondaryButton}
                    >
                      <Eye size={18} />
                      View Certificate
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadCertificate(
                          certificateFilename,
                          activity.id
                        )
                      }
                      disabled={!certificateFilename}
                      style={secondaryButton}
                    >
                      <Download size={18} />
                      Download
                    </button>
                  </div>

                  {activity.reviewComment && (
                    <div
                      style={{
                        marginTop: 18,
                        padding: 15,
                        borderRadius: 10,
                        background: "#f1f4ee",
                      }}
                    >
                      <strong>Faculty remarks:</strong>
                      <p style={{ marginBottom: 0 }}>
                        {activity.reviewComment}
                      </p>

                      {activity.reviewedBy && (
                        <small style={{ color: "#718078" }}>
                          Reviewed by {activity.reviewedBy}
                        </small>
                      )}
                    </div>
                  )}

                  {isPending && (
                    <>
                      <div
                        style={{
                          borderTop: "1px solid #e7e8df",
                          marginTop: 24,
                          paddingTop: 24,
                        }}
                      >
                        <label
                          htmlFor={`remarks-${activity.id}`}
                          style={{
                            display: "block",
                            fontWeight: 600,
                            marginBottom: 12,
                          }}
                        >
                          Faculty remarks
                        </label>

                        <textarea
                          id={`remarks-${activity.id}`}
                          value={remarks[activity.id] || ""}
                          onChange={(e) =>
                            setRemarks((previous) => ({
                              ...previous,
                              [activity.id]: e.target.value,
                            }))
                          }
                          placeholder="Add feedback or rejection reason..."
                          rows={3}
                          style={textareaStyle}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 14,
                          marginTop: 18,
                        }}
                      >
                        <button
                          type="button"
                          disabled={isReviewing}
                          onClick={() =>
                            handleReview(activity, "VERIFIED")
                          }
                          style={{
                            ...primaryButton,
                            background: "#287348",
                            opacity: isReviewing ? 0.65 : 1,
                          }}
                        >
                          <CheckCircle2 size={20} />
                          {isReviewing ? "Processing..." : "Verify"}
                        </button>

                        <button
                          type="button"
                          disabled={isReviewing}
                          onClick={() =>
                            handleReview(activity, "REJECTED")
                          }
                          style={{
                            ...primaryButton,
                            background: "#a8392c",
                            opacity: isReviewing ? 0.65 : 1,
                          }}
                        >
                          <XCircle size={20} />
                          Reject
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer
        style={{
          textAlign: "center",
          color: "#839088",
          marginTop: 38,
          paddingBottom: 12,
        }}
      >
        Student Activity Hub · Faculty Review Workspace
      </footer>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <Icon size={19} style={{ color: "#748579", marginTop: 2 }} />

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            color: "#718078",
            marginBottom: 5,
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontWeight: 600,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function statusStyle(status) {
  const colors = {
    PENDING: { background: "#fff2d9", color: "#946313" },
    VERIFIED: { background: "#e0f2e5", color: "#24663c" },
    REJECTED: { background: "#fde7e3", color: "#a33126" },
  };

  return {
    display: "inline-block",
    padding: "8px 13px",
    borderRadius: 30,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.3,
    ...colors[status],
  };
}

const statCardStyle = {
  background: "#fff",
  border: "1px solid #e7e8df",
  borderRadius: 21,
  padding: "30px",
  boxSizing: "border-box",
};

const panelStyle = {
  background: "#fff",
  border: "1px solid #e7e8df",
  borderRadius: 24,
  padding: "clamp(20px, 2.5vw, 34px)",
  boxSizing: "border-box",
};

const reportHeaderCellStyle = {
  padding: "14px 8px",
  color: "#52665b",
  fontSize: "clamp(10px, 1.15vw, 13px)",
  fontWeight: 700,
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  borderBottom: "1px solid #e7e8df",
};

const reportCellStyle = {
  padding: "16px 8px",
  borderBottom: "1px solid #edf0e9",
  verticalAlign: "middle",
  fontSize: "clamp(11px, 1.2vw, 14px)",
  overflowWrap: "anywhere",
};

const countBadgeStyle = {
  display: "inline-flex",
  minWidth: 26,
  maxWidth: "100%",
  boxSizing: "border-box",
  justifyContent: "center",
  padding: "6px 7px",
  borderRadius: 20,
  background: "#edf1eb",
  color: "#243c32",
  fontWeight: 700,
};

const submissionCardStyle = {
  border: "1px solid #e4e6dd",
  borderRadius: 21,
  padding: "clamp(18px, 2vw, 28px)",
  boxSizing: "border-box",
};

const primaryButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  border: "none",
  borderRadius: 12,
  padding: "16px 22px",
  background: "#243c32",
  color: "#fff",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  border: "1px solid #e0e5dc",
  borderRadius: 12,
  padding: "14px 19px",
  background: "#fff",
  color: "#243c32",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const selectStyle = {
  border: "1px solid #dfe4da",
  borderRadius: 12,
  padding: "14px 16px",
  background: "#fff",
  color: "#243c32",
  fontSize: 15,
  cursor: "pointer",
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #dce2d8",
  borderRadius: 12,
  padding: 16,
  font: "inherit",
  fontSize: 16,
  resize: "vertical",
  outlineColor: "#537660",
};

const errorStyle = {
  background: "#fff0ed",
  color: "#a33126",
  borderRadius: 12,
  padding: 16,
  marginBottom: 18,
};

const successStyle = {
  background: "#e8f5e9",
  color: "#24663c",
  borderRadius: 12,
  padding: 16,
  marginBottom: 18,
};

const emptyStateStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "55px 20px",
  color: "#718078",
};