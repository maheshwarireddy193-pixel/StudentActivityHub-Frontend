import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  X,
} from "lucide-react";
import api from "../../services/api";
import "../../App.css";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, section: "overview" },
  { label: "My activities", icon: Activity, section: "activities" },
  { label: "Certificates", icon: FileCheck2, section: "certificates" },
  { label: "AI resume builder", icon: Sparkles, section: "resume" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All activities");

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real activities from the backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/activities");

        setActivities(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch activities:", err);

        setError(
          err.response?.status === 401 || err.response?.status === 403
            ? "Your session may have expired. Please log in again."
            : "Unable to load activities. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Calculate activity statistics
  const verifiedCount = activities.filter(
    (activity) => activity.status?.toUpperCase() === "VERIFIED"
  ).length;

  const pendingCount = activities.filter(
    (activity) => activity.status?.toUpperCase() === "PENDING"
  ).length;

  const rejectedCount = activities.filter(
    (activity) => activity.status?.toUpperCase() === "REJECTED"
  ).length;

  // Each verified activity earns 10 points
  const totalPoints = verifiedCount * 10;
    const achievements = [
  {
    title: "First Achievement",
    description: "Verify your first activity.",
    required: 1,
    icon: "🥉",
  },
  {
    title: "Rising Star",
    description: "Verify 5 activities.",
    required: 5,
    icon: "🥈",
  },
  {
    title: "Achievement Champion",
    description: "Verify 10 activities.",
    required: 10,
    icon: "🥇",
  },
];

const nextAchievement = achievements.find(
  (achievement) => verifiedCount < achievement.required
);

const achievementProgress = nextAchievement
  ? Math.min(
      100,
      Math.round((verifiedCount / nextAchievement.required) * 100)
    )
  : 100;
  // Search and filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = (activity.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All activities" ||
      activity.status?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const verificationProgress = activities.length
    ? Math.round((verifiedCount / activities.length) * 100)
    : 0;

  const handleNavigation = (item) => {
    setActiveNav(item.label);
    setMenuOpen(false);

    if (item.section === "overview") {
      document.getElementById("overview")?.scrollIntoView({
        behavior: "smooth",
      });
    } else if (item.section === "activities") {
      document.getElementById("activities")?.scrollIntoView({
        behavior: "smooth",
      });
    } else if (item.section === "certificates") {
      navigate("/submit-certificate");
    } else if (item.section === "resume") {
      navigate("/resume-builder");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="dash-page">
      {menuOpen && (
        <button
          type="button"
          className="dash-mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`dash-sidebar ${
          menuOpen ? "dash-sidebar-open" : ""
        }`}
      >
        <Link
          to="/dashboard"
          className="dash-brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="dash-brand-mark">
            <BookOpen size={21} strokeWidth={1.8} />
          </span>

          <span className="dash-brand-name">
            student<span>activity</span>
            <small>HUB</small>
          </span>

          <button
            type="button"
            className="dash-close-menu"
            aria-label="Close navigation"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setMenuOpen(false);
            }}
          >
            <X size={19} />
          </button>
        </Link>

        <div className="dash-sidebar-label">WORKSPACE</div>

        <nav className="dash-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.label}
                className={`dash-nav-item ${
                  activeNav === item.label ? "dash-nav-active" : ""
                }`}
                onClick={() => handleNavigation(item)}
              >
                <Icon size={18} strokeWidth={1.8} />

                <span>{item.label}</span>

                {item.label === "My activities" && (
                  <span className="dash-nav-count">
                    {activities.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="dash-sidebar-label dash-tools-label">
          PREFERENCES
        </div>

        <button
          type="button"
          className="dash-nav-item"
          onClick={() => navigate("/profile")}
        >
          <UserRound size={18} strokeWidth={1.8} />
          <span>My profile</span>
        </button>

        <button
          type="button"
          className="dash-nav-item"
          onClick={() => navigate("/settings")}
        >
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </button>

        <div className="dash-sidebar-bottom">
          <div className="dash-help-card">
            <span className="dash-help-icon">
              <Sparkles size={17} />
            </span>

            <h3>Your next milestone</h3>

            <p>
              Keep adding your achievements and build your campus story.
            </p>

            <button
              type="button"
              onClick={() => navigate("/submit-certificate")}
            >
              Add an activity <ArrowUpRight size={14} />
            </button>
          </div>

          <button
            type="button"
            className="dash-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Sign out</span>
          </button>

          <p className="dash-sidebar-version">
            STUDENT ACTIVITY HUB · 2026
          </p>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button
              type="button"
              className="dash-mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div className="dash-breadcrumb">
              Workspace <span>/</span> <strong>Overview</strong>
            </div>
          </div>

          <div className="dash-topbar-actions">
            <div className="dash-date">
              <CalendarDays size={15} />
              <span>Academic year 2026–27</span>
            </div>

            <button
              type="button"
              className="dash-icon-button"
              aria-label="Notifications"
              title="Notifications"
              onClick={() =>
                window.alert(
                  "You're all caught up with your notifications."
                )
              }
            >
              <Bell size={18} />
              <span className="dash-notification-dot" />
            </button>

            <button
              type="button"
              className="dash-user-menu"
              onClick={() => navigate("/profile")}
            >
              <span className="dash-avatar">S</span>

              <span className="dash-user-info">
                <strong>Student</strong>
                <small>Student account</small>
              </span>

              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <div className="dash-content" id="overview">
          <section className="dash-welcome">
            <div>
              <div className="dash-eyebrow">
                <span />
                YOUR PERSONAL WORKSPACE
              </div>

              <h1>
                A little progress,
                <br />
                <em>a lot of possibility.</em>
              </h1>

              <p>
                Keep track of your campus journey. Every activity you
                record brings you one step closer to your goals.
              </p>
            </div>

            <div className="dash-welcome-actions">
              <button
                type="button"
                className="dash-primary-button"
                onClick={() => navigate("/submit-certificate")}
              >
                <Plus size={17} />
                Add an activity
              </button>

              <button
                type="button"
                className="dash-secondary-button"
                onClick={() => navigate("/resume-builder")}
              >
                Build my resume <ArrowUpRight size={16} />
              </button>
            </div>
          </section>

          <section
            className="dash-stats-grid"
            aria-label="Activity statistics"
          >
            <article className="dash-stat-card dash-stat-featured">
              <div className="dash-stat-top">
                <span>Total activities</span>

                <span className="dash-stat-icon">
                  <Activity size={19} />
                </span>
              </div>

              <div className="dash-stat-number">
                {loading ? "—" : activities.length.toString().padStart(2, "0")}
              </div>

              <div className="dash-stat-bottom">
                <span>Recorded so far</span>

                <span className="dash-stat-note">
                  <ArrowUpRight size={13} /> Keep going
                </span>
              </div>
            </article>

            <article className="dash-stat-card">
              <div className="dash-stat-top">
                <span>Verified</span>

                <span className="dash-stat-icon dash-icon-verified">
                  <CheckCircle2 size={19} />
                </span>
              </div>

              <div className="dash-stat-number">
                {loading ? "—" : verifiedCount}
              </div>

              <div className="dash-stat-bottom">
                <span>Approved achievements</span>

                <span className="dash-stat-note dash-note-green">
                  <CheckCircle2 size={13} /> Approved
                </span>
              </div>
            </article>

            <article className="dash-stat-card">
              <div className="dash-stat-top">
                <span>Under review</span>

                <span className="dash-stat-icon dash-icon-pending">
                  <Clock3 size={19} />
                </span>
              </div>

              <div className="dash-stat-number">
                {loading ? "—" : pendingCount}
              </div>

              <div className="dash-stat-bottom">
                <span>Awaiting faculty review</span>

                <span className="dash-stat-note dash-note-pending">
                  <Clock3 size={13} /> In progress
                </span>
              </div>
            </article>

            <article className="dash-stat-card">
              <div className="dash-stat-top">
                <span>Total points</span>

                <span className="dash-stat-icon dash-icon-rejected">
                  <Award size={19} />
                </span>
              </div>

              <div className="dash-stat-number">
                {loading ? "—" : totalPoints}
              </div>

              <div className="dash-stat-bottom">
                <span>From verified activities</span>

                <span className="dash-stat-note dash-note-green">
                  <CheckCircle2 size={13} /> Earned
                </span>
              </div>
            </article>
          </section>
                {/* ACHIEVEMENTS SECTION */}
<section
  style={{
    background: "#ffffff",
    border: "1px solid #e7e8df",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "28px",
  }}
>
  <div style={{ marginBottom: "24px" }}>
    <div
      style={{
        color: "#718078",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "1.5px",
        marginBottom: "8px",
      }}
    >
      YOUR MILESTONES
    </div>

    <h2 style={{ margin: "0 0 8px", color: "#243c32" }}>
      🏆 Achievements
    </h2>

    <p style={{ color: "#718078", margin: 0 }}>
      Keep verifying your activities and unlock new milestones!
    </p>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "18px",
    }}
  >
    {achievements.map((achievement) => {
      const unlocked = verifiedCount >= achievement.required;

      return (
        <article
          key={achievement.title}
          style={{
            border: unlocked
              ? "1px solid #b8d8bf"
              : "1px solid #e7e8df",
            background: unlocked ? "#f0f7f0" : "#fafaf7",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>
            {achievement.icon}
          </div>

          <h3 style={{ margin: "0 0 8px", color: "#243c32" }}>
            {achievement.title}
          </h3>

          <p
            style={{
              color: "#718078",
              fontSize: "14px",
              lineHeight: 1.6,
              minHeight: "44px",
            }}
          >
            {achievement.description}
          </p>

          <div
            style={{
              fontWeight: "700",
              color: unlocked ? "#287348" : "#946313",
              fontSize: "13px",
            }}
          >
            {unlocked ? "✓ Unlocked!" : "🔒 Locked"}
          </div>

          <div
            style={{
              marginTop: "14px",
              background: "#e5e9e1",
              borderRadius: "10px",
              height: "7px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (verifiedCount / achievement.required) * 100
                  )
                )}%`,
                background: unlocked ? "#287348" : "#a6b8a6",
                height: "100%",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: "12px",
              color: "#718078",
            }}
          >
            {Math.min(verifiedCount, achievement.required)} /{" "}
            {achievement.required} verified activities
          </p>
        </article>
      );
    })}
  </div>

  <div
    style={{
      marginTop: "22px",
      padding: "18px",
      background: "#f5f5ee",
      borderRadius: "14px",
    }}
  >
    <strong style={{ color: "#243c32" }}>
      {nextAchievement
        ? `Next milestone: ${nextAchievement.title}`
        : "🎉 All achievements unlocked!"}
    </strong>

    <p style={{ margin: "8px 0 12px", color: "#718078" }}>
      {nextAchievement
        ? `${Math.max(
            0,
            nextAchievement.required - verifiedCount
          )} more verified ${
            nextAchievement.required - verifiedCount === 1
              ? "activity"
              : "activities"
          } to reach your next milestone.`
        : "Amazing work! You have reached every current milestone."}
    </p>

    <div
      style={{
        height: "8px",
        background: "#e1e6dc",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${achievementProgress}%`,
          height: "100%",
          background: "#287348",
          transition: "width 0.3s ease",
        }}
      />
    </div>

    <p
      style={{
        textAlign: "right",
        fontSize: "12px",
        color: "#718078",
        margin: "8px 0 0",
      }}
    >
      {achievementProgress}% complete
    </p>
  </div>
</section>
          <section className="dash-feature-row">
            <article className="dash-progress-card">
              <div className="dash-section-eyebrow">
                YOUR JOURNEY
              </div>

              <div className="dash-progress-heading">
                <div>
                  <h2>Building your portfolio</h2>
                  <p>Your activities tell your story.</p>
                </div>

                <span className="dash-progress-icon">
                  <Target size={22} />
                </span>
              </div>

              <div className="dash-progress-meta">
                <span>Verification progress</span>

                <strong>
                  {loading ? "—" : verificationProgress}%
                </strong>
              </div>

              <div
                className="dash-progress-track"
                role="progressbar"
                aria-label="Verification progress"
                aria-valuenow={verificationProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span
                  style={{
                    width: `${verificationProgress}%`,
                  }}
                />
              </div>

              <div className="dash-progress-footer">
                <span>
                  <CheckCircle2 size={14} /> {verifiedCount} verified
                </span>

                <span>{activities.length} total activities</span>
              </div>
            </article>

            <article className="dash-resume-card">
              <div className="dash-resume-card-top">
                <span className="dash-resume-icon">
                  <Sparkles size={19} />
                </span>

                <span className="dash-resume-tag">
                  YOUR NEXT STEP
                </span>
              </div>

              <h2>Turn your activities into opportunities.</h2>

              <p>
                Bring your skills, internships, and achievements
                together in a resume that represents you.
              </p>

              <button
                type="button"
                onClick={() => navigate("/resume-builder")}
              >
                Explore resume builder <ArrowRight size={16} />
              </button>
            </article>
          </section>

          <section
            className="dash-activities-section"
            id="activities"
          >
            <div className="dash-activities-heading">
              <div>
                <div className="dash-section-eyebrow">
                  YOUR RECORD
                </div>

                <h2>Recent activities</h2>

                <p>
                  A quick look at your latest campus achievements.
                </p>
              </div>

              <button
                type="button"
                className="dash-view-all"
                onClick={() => {
                  setActiveNav("My activities");

                  document.getElementById("activities")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                View all <ArrowRight size={15} />
              </button>
            </div>

            <div className="dash-activity-toolbar">
              <div className="dash-search">
                <Search size={16} />

                <input
                  type="search"
                  placeholder="Search activities..."
                  aria-label="Search activities"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <select
                className="dash-filter"
                aria-label="Filter by activity status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option>All activities</option>
                <option>Verified</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="dash-table-wrap">
              <table className="dash-activity-table">
                <thead>
                  <tr>
                    <th>ACTIVITY</th>
                    <th>CATEGORY</th>
                    <th>DATE ADDED</th>
                    <th>STATUS</th>
                    <th>POINTS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="5" className="dash-empty-state">
                        Loading your activities...
                      </td>
                    </tr>
                  )}

                  {!loading && error && (
                    <tr>
                      <td colSpan="5" className="dash-empty-state">
                        {error}
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    filteredActivities.map((activity) => {
                      const status = (
                        activity.status || "PENDING"
                      ).toUpperCase();

                      const points = status === "VERIFIED" ? 10 : 0;

                      return (
                        <tr key={activity.id}>
                          <td>
                            <div className="dash-activity-name">
                              <span className="dash-activity-file">
                                <Award size={18} />
                              </span>

                              <span>{activity.title}</span>
                            </div>
                          </td>

                          <td>
                            <span className="dash-category">
                              {activity.category || "—"}
                            </span>
                          </td>

                          <td className="dash-activity-date">
                            {formatDate(activity.createdAt)}
                          </td>

                          <td>
                            <span
                              className={`dash-status dash-status-${status.toLowerCase()}`}
                            >
                              <span />
                              {status}
                            </span>
                          </td>

                          <td className="dash-points">
                            {points}
                          </td>
                        </tr>
                      );
                    })}

                  {!loading &&
                    !error &&
                    filteredActivities.length === 0 && (
                      <tr>
                        <td colSpan="5" className="dash-empty-state">
                          {activities.length === 0
                            ? "You haven't submitted any activities yet."
                            : "No activities match your search."}
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            <div className="dash-table-footer">
              <span>
                Showing {loading ? "—" : filteredActivities.length} of{" "}
                {loading ? "—" : activities.length} activities
              </span>

              <span className="dash-table-footer-note">
                <ShieldCheck size={14} />
                Your achievements, all in one place
              </span>
            </div>
          </section>

          <footer className="dash-footer">
            <span>© 2026 Student Activity Hub</span>
            <span>Made for every milestone.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}