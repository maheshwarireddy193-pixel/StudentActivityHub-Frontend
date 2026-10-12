import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCog,
  ClipboardList,
  Clock,
  Search,
  RefreshCw,
  Trash2,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FolderKanban,
} from "lucide-react";

import api from "../../services/api";
import "../../App.css";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f6f0",
    color: "#203b2e",
    fontFamily: "'DM Sans', sans-serif",
  },
  sidebar: {
    width: "245px",
    background: "#173f32",
    color: "#fff",
    padding: "28px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flexShrink: 0,
  },
  brand: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "23px",
    marginBottom: "34px",
    padding: "0 10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 12px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#e0e9e1",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "left",
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: "32px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e6e9df",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 4px 18px rgba(24, 59, 43, 0.04)",
  },
  muted: {
    color: "#78877d",
    fontSize: "13px",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    padding: "10px 14px",
    borderRadius: "9px",
    border: "1px solid #dce5db",
    background: "#fff",
    color: "#244d39",
    cursor: "pointer",
    fontWeight: 600,
  },
  input: {
    padding: "11px 13px",
    borderRadius: "9px",
    border: "1px solid #dce3d9",
    background: "#fff",
    color: "#203b2e",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px",
  },
  th: {
    padding: "14px 12px",
    textAlign: "left",
    color: "#728176",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    borderBottom: "1px solid #e9ede6",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "15px 12px",
    borderBottom: "1px solid #edf0e9",
    fontSize: "13px",
    verticalAlign: "middle",
  },
};

const roleColors = {
  STUDENT: { background: "#e4f1e5", color: "#28613d" },
  FACULTY: { background: "#e5eafa", color: "#4056a1" },
  ADMIN: { background: "#f7ead1", color: "#8c5b16" },
};

const statusColors = {
  PENDING: { background: "#fff1d8", color: "#936119" },
  VERIFIED: { background: "#e2f3e5", color: "#27683b" },
  REJECTED: { background: "#fbe5e3", color: "#a33e37" },
};

function Badge({ children, colors }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        background: colors?.background || "#edf0e9",
        color: colors?.color || "#506052",
        whiteSpace: "nowrap",
      }}
    >
      {children || "UNKNOWN"}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div style={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <div>
          <p style={{ ...styles.muted, margin: 0 }}>{title}</p>
          <h2 style={{ fontSize: "30px", margin: "12px 0 5px" }}>
            {value ?? 0}
          </h2>
          <p style={{ ...styles.muted, margin: 0 }}>{description}</p>
        </div>

        <div
          style={{
            background: "#e8f0e6",
            color: "#28533a",
            padding: "11px",
            borderRadius: "12px",
          }}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [activityFilter, setActivityFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/faculty/activities"),
        api.get("/faculty/portfolios"),
      ]);

      const [statsResult, usersResult, activitiesResult, portfoliosResult] =
        results;

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value.data || {});
      }

      if (usersResult.status === "fulfilled") {
        setUsers(
          Array.isArray(usersResult.value.data) ? usersResult.value.data : []
        );
      }

      // Activity and portfolio APIs are faculty-protected.
      // Do not call them using an admin token unless backend permissions
      // explicitly allow the ADMIN role.
      if (activitiesResult.status === "fulfilled") {
        setActivities(
          Array.isArray(activitiesResult.value.data)
            ? activitiesResult.value.data
            : []
        );
      }

      if (portfoliosResult.status === "fulfilled") {
        setPortfolios(
          Array.isArray(portfoliosResult.value.data)
            ? portfoliosResult.value.data
            : []
        );
      }

      if (
        statsResult.status === "rejected" &&
        usersResult.status === "rejected"
      ) {
        setError(
          "Unable to load admin data. Please log in with an Admin account."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        String(user.name || "").toLowerCase().includes(query) ||
        String(user.email || "").toLowerCase().includes(query) ||
        String(user.id || "").includes(query);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const filteredActivities = useMemo(() => {
    if (activityFilter === "ALL") return activities;

    return activities.filter(
      (activity) => activity.status === activityFilter
    );
  }, [activities, activityFilter]);

  const deleteUser = async (user) => {
    if (user.role === "ADMIN") {
      setError("Admin accounts cannot be deleted from this dashboard.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name} (${user.email})?`
    );

    if (!confirmed) return;

    setDeletingId(user.id);
    setError("");
    setMessage("");

    try {
      await api.delete(`/admin/users/${user.id}`);

      setUsers((current) =>
        current.filter((item) => item.id !== user.id)
      );

      setMessage("User deleted successfully.");
      await loadStatsOnly();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete this user. They may have activities linked to their account."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const loadStatsOnly = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data || {});
    } catch {
      // Keep the existing statistics if refreshing fails.
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "activities", label: "Activities", icon: ClipboardList },
    { id: "portfolios", label: "Student Portfolios", icon: FolderKanban },
  ];

  const pageTitle = {
    overview: "Admin Overview",
    users: "User Management",
    activities: "Activity Management",
    portfolios: "Student Portfolios",
  };

  return (
    <div
      style={{
        ...styles.page,
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <ShieldCheck
            size={25}
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          />
          StudentActivityHub
        </div>

        <p
          style={{
            fontSize: "10px",
            color: "#a7c2ad",
            letterSpacing: "1.5px",
            padding: "0 12px",
          }}
        >
          ADMINISTRATION
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setError("");
                setMessage("");
              }}
              style={{
                ...styles.navItem,
                background: active ? "#2c5b45" : "transparent",
                color: active ? "#fff" : "#d7e4d9",
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        <div
          style={{
            borderTop: "1px solid #3c5d4d",
            paddingTop: "18px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#dcebdc",
                color: "#214b34",
                display: "grid",
                placeItems: "center",
              }}
            >
              <UserCog size={19} />
            </div>

            <div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                Administrator
              </div>
              <div style={{ fontSize: "11px", color: "#b7cdbb" }}>
                Admin account
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              ...styles.navItem,
              width: "100%",
              color: "#f0d5d1",
            }}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
            flexWrap: "wrap",
            marginBottom: "28px",
          }}
        >
          <div>
            <p
              style={{
                ...styles.muted,
                margin: "0 0 6px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              STUDENTACTIVITYHUB / ADMIN
            </p>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "32px",
                margin: 0,
              }}
            >
              {pageTitle[activeSection]}
            </h1>

            <p style={{ ...styles.muted, margin: "9px 0 0" }}>
              Manage users and monitor platform activity.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            style={styles.button}
          >
            <RefreshCw
              size={16}
              style={{
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
            Refresh
          </button>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              padding: "13px 16px",
              background: "#fbe8e5",
              color: "#963d35",
              borderRadius: "10px",
              marginBottom: "18px",
              fontSize: "13px",
            }}
          >
            <AlertCircle
              size={17}
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            style={{
              padding: "13px 16px",
              background: "#e4f3e5",
              color: "#28623b",
              borderRadius: "10px",
              marginBottom: "18px",
              fontSize: "13px",
            }}
          >
            <CheckCircle2
              size={17}
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ ...styles.card, textAlign: "center", padding: "60px" }}>
            <RefreshCw
              size={28}
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p>Loading admin dashboard...</p>
          </div>
        ) : (
          <>
            {activeSection === "overview" && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: "16px",
                    marginBottom: "26px",
                  }}
                >
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    description="Registered accounts"
                  />

                  <StatCard
                    title="Students"
                    value={stats.totalStudents}
                    icon={GraduationCap}
                    description="Student accounts"
                  />

                  <StatCard
                    title="Faculty"
                    value={stats.totalFaculty}
                    icon={UserCog}
                    description="Faculty accounts"
                  />

                  <StatCard
                    title="Total Activities"
                    value={stats.totalActivities}
                    icon={ClipboardList}
                    description="Recorded submissions"
                  />

                  <StatCard
                    title="Pending Activities"
                    value={stats.pendingActivities}
                    icon={Clock}
                    description="Awaiting review"
                  />

                  <StatCard
                    title="Administrators"
                    value={stats.totalAdmins}
                    icon={ShieldCheck}
                    description="Admin accounts"
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(270px, 1fr))",
                    gap: "18px",
                  }}
                >
                  <div style={styles.card}>
                    <h3 style={{ margin: "0 0 8px" }}>User Management</h3>
                    <p style={styles.muted}>
                      View registered accounts, search users, and filter by
                      role.
                    </p>
                    <button
                      style={styles.button}
                      onClick={() => setActiveSection("users")}
                    >
                      <Users size={16} /> Manage Users
                    </button>
                  </div>

                  <div style={styles.card}>
                    <h3 style={{ margin: "0 0 8px" }}>Activity Management</h3>
                    <p style={styles.muted}>
                      Monitor student activity submissions and their current
                      statuses.
                    </p>
                    <button
                      style={styles.button}
                      onClick={() => setActiveSection("activities")}
                    >
                      <ClipboardList size={16} /> View Activities
                    </button>
                  </div>

                  <div style={styles.card}>
                    <h3 style={{ margin: "0 0 8px" }}>Student Portfolios</h3>
                    <p style={styles.muted}>
                      Explore student projects and professional profiles when
                      the relevant API permits admin access.
                    </p>
                    <button
                      style={styles.button}
                      onClick={() => setActiveSection("portfolios")}
                    >
                      <FolderKanban size={16} /> View Portfolios
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeSection === "users" && (
              <section style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "14px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h2 style={{ margin: "0 0 6px", fontSize: "20px" }}>
                      Registered Users
                    </h2>
                    <p style={{ ...styles.muted, margin: 0 }}>
                      {filteredUsers.length} users displayed
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ position: "relative", minWidth: "220px" }}>
                      <Search
                        size={16}
                        style={{
                          position: "absolute",
                          left: "11px",
                          top: "13px",
                          color: "#849184",
                        }}
                      />
                      <input
                        aria-label="Search users"
                        placeholder="Search name, email or ID..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        style={{ ...styles.input, paddingLeft: "36px" }}
                      />
                    </div>

                    <select
                      aria-label="Filter users by role"
                      value={roleFilter}
                      onChange={(event) => setRoleFilter(event.target.value)}
                      style={{ ...styles.input, width: "auto" }}
                    >
                      <option value="ALL">All Roles</option>
                      <option value="STUDENT">Students</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="ADMIN">Admins</option>
                    </select>
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>User</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Role</th>
                        <th style={styles.th}>User ID</th>
                        <th style={styles.th}>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td style={styles.td}>
                            <strong>{user.name}</strong>
                          </td>
                          <td style={styles.td}>{user.email}</td>
                          <td style={styles.td}>
                            <Badge colors={roleColors[user.role]}>
                              {user.role}
                            </Badge>
                          </td>
                          <td style={styles.td}>{user.id}</td>
                          <td style={styles.td}>
                            <button
                              title={
                                user.role === "ADMIN"
                                  ? "Admin accounts cannot be deleted"
                                  : "Delete user"
                              }
                              disabled={
                                user.role === "ADMIN" ||
                                deletingId === user.id
                              }
                              onClick={() => deleteUser(user)}
                              style={{
                                ...styles.button,
                                padding: "8px 10px",
                                color: "#a33e37",
                                opacity:
                                  user.role === "ADMIN" ||
                                  deletingId === user.id
                                    ? 0.45
                                    : 1,
                                cursor:
                                  user.role === "ADMIN" ||
                                  deletingId === user.id
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              <Trash2 size={15} />
                              {deletingId === user.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredUsers.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            style={{
                              ...styles.td,
                              textAlign: "center",
                              padding: "35px",
                              color: "#7b897d",
                            }}
                          >
                            No users match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeSection === "activities" && (
              <section style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "14px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h2 style={{ margin: "0 0 6px", fontSize: "20px" }}>
                      Activity Submissions
                    </h2>
                    <p style={{ ...styles.muted, margin: 0 }}>
                      Activity data is shown only when the backend allows this
                      account to access it.
                    </p>
                  </div>

                  <select
                    value={activityFilter}
                    onChange={(event) => setActivityFilter(event.target.value)}
                    style={{ ...styles.input, width: "auto" }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {activities.length === 0 ? (
                  <p style={styles.muted}>
                    No activities are available to this admin account yet. The
                    activity endpoint currently requires Faculty access.
                  </p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Activity</th>
                          <th style={styles.th}>Category</th>
                          <th style={styles.th}>Student</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredActivities.map((activity) => (
                          <tr key={activity.id}>
                            <td style={styles.td}>
                              <strong>{activity.title}</strong>
                            </td>
                            <td style={styles.td}>
                              {activity.category || "—"}
                            </td>
                            <td style={styles.td}>
                              {activity.studentName || "—"}
                            </td>
                            <td style={styles.td}>
                              <Badge colors={statusColors[activity.status]}>
                                {activity.status}
                              </Badge>
                            </td>
                            <td style={styles.td}>
                              {activity.createdAt
                                ? new Date(
                                    activity.createdAt
                                  ).toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        ))}

                        {filteredActivities.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              style={{
                                ...styles.td,
                                textAlign: "center",
                              }}
                            >
                              No activities found for this filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeSection === "portfolios" && (
              <section style={styles.card}>
                <h2 style={{ margin: "0 0 8px", fontSize: "20px" }}>
                  Student Portfolio Directory
                </h2>

                <p style={styles.muted}>
                  Explore student projects and professional links when
                  permitted by backend security.
                </p>

                {portfolios.length === 0 ? (
                  <div
                    style={{
                      padding: "28px 10px",
                      textAlign: "center",
                      color: "#78877d",
                    }}
                  >
                    <FolderKanban size={32} />
                    <p>
                      Portfolio data isn't available to this account yet.
                    </p>
                    <p style={{ fontSize: "12px" }}>
                      Your portfolio endpoint currently requires Faculty
                      access.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: "16px",
                      marginTop: "20px",
                    }}
                  >
                    {portfolios.map((student) => (
                      <article
                        key={student.studentId}
                        style={{
                          border: "1px solid #e4e9df",
                          borderRadius: "14px",
                          padding: "20px",
                          background: "#fcfcf8",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            marginBottom: "15px",
                          }}
                        >
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "50%",
                              display: "grid",
                              placeItems: "center",
                              background: "#e2eee1",
                              color: "#245337",
                            }}
                          >
                            <GraduationCap size={22} />
                          </div>

                          <div>
                            <h3 style={{ margin: 0, fontSize: "16px" }}>
                              {student.name}
                            </h3>
                            <p style={{ ...styles.muted, margin: "5px 0 0" }}>
                              {student.rollNumber || "No roll number"}
                            </p>
                          </div>
                        </div>

                        <p
                          style={{
                            fontSize: "13px",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {student.email}
                        </p>

                        <p style={styles.muted}>
                          {student.projects?.length || 0} projects
                        </p>

                        {(student.githubUrl ||
                          student.linkedinUrl ||
                          student.leetcodeUrl ||
                          student.portfolioUrl) && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                              marginTop: "12px",
                            }}
                          >
                            {[
                              ["GitHub", student.githubUrl],
                              ["LinkedIn", student.linkedinUrl],
                              ["LeetCode", student.leetcodeUrl],
                              ["Portfolio", student.portfolioUrl],
                            ]
                              .filter(([, url]) => url)
                              .map(([label, url]) => (
                                <a
                                  key={label}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    fontSize: "12px",
                                    color: "#28613d",
                                    textDecoration: "none",
                                    padding: "6px 9px",
                                    border: "1px solid #dce7da",
                                    borderRadius: "8px",
                                  }}
                                >
                                  {label} ↗
                                </a>
                              ))}
                          </div>
                        )}

                        <div
                          style={{
                            borderTop: "1px solid #e8ece4",
                            marginTop: "16px",
                            paddingTop: "14px",
                          }}
                        >
                          {student.projects?.length ? (
                            student.projects.map((project) => (
                              <div
                                key={project.id}
                                style={{ marginBottom: "14px" }}
                              >
                                <strong style={{ fontSize: "13px" }}>
                                  {project.title}
                                </strong>

                                {project.description && (
                                  <p
                                    style={{
                                      ...styles.muted,
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {project.description}
                                  </p>
                                )}

                                {project.technologies && (
                                  <p
                                    style={{
                                      fontSize: "11px",
                                      color: "#617466",
                                    }}
                                  >
                                    {project.technologies}
                                  </p>
                                )}

                                {project.githubUrl && (
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      fontSize: "12px",
                                      color: "#28613d",
                                      marginRight: "12px",
                                    }}
                                  >
                                    GitHub ↗
                                  </a>
                                )}

                                {project.liveDemoUrl && (
                                  <a
                                    href={project.liveDemoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      fontSize: "12px",
                                      color: "#28613d",
                                    }}
                                  >
                                    Live Demo ↗
                                  </a>
                                )}
                              </div>
                            ))
                          ) : (
                            <p style={styles.muted}>
                              No projects added yet.
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        <footer
          style={{
            textAlign: "center",
            padding: "28px 0 8px",
            color: "#879287",
            fontSize: "12px",
          }}
        >
          StudentActivityHub · Administration Portal
        </footer>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 760px) {
          aside {
            max-width: 175px;
            padding: 18px 10px !important;
          }

          main {
            padding: 18px !important;
          }
        }

        @media (max-width: 520px) {
          aside {
            width: 58px !important;
            padding: 16px 6px !important;
            overflow: hidden;
          }

          aside > div:first-child {
            font-size: 0 !important;
            padding: 0 !important;
          }

          aside > div:first-child svg {
            font-size: initial;
            margin: 0 !important;
          }

          aside button {
            font-size: 0 !important;
            justify-content: center !important;
            padding: 12px 4px !important;
          }

          aside button svg {
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  );
}