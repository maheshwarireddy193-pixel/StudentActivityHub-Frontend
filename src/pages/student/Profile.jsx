import { useEffect, useState } from "react";
import {
  UserRound,
  Code,
  Globe,
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ExternalLink,
} from "lucide-react";

import api from "../../services/api";
import "./Profile.css";

const emptyProfile = {
  githubUrl: "",
  linkedinUrl: "",
  leetcodeUrl: "",
  portfolioUrl: "",
};

const emptyProject = {
  title: "",
  description: "",
  technologies: "",
  githubUrl: "",
  liveDemoUrl: "",
};

function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProject);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingProject, setSavingProject] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load profile and projects
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [profileResponse, projectsResponse] = await Promise.all([
        api.get("/profile/me"),
        api.get("/projects/my"),
      ]);

      setProfile({
        ...emptyProfile,
        ...profileResponse.data,
      });

      setProjects(
        Array.isArray(projectsResponse.data)
          ? projectsResponse.data
          : []
      );
    } catch (err) {
      console.error("Loading profile failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your profile. Please check your login and backend."
      );
    } finally {
      setLoading(false);
    }
  }

  // Update profile fields
  function handleProfileChange(e) {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Save profile
  async function saveProfile(e) {
    e.preventDefault();

    setSavingProfile(true);
    setMessage("");
    setError("");

    try {
      const response = await api.put("/profile/me", profile);

      setProfile((previous) => ({
        ...previous,
        ...response.data,
      }));

      setMessage("Profile saved successfully!");
    } catch (err) {
      console.error("Saving profile failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save your profile. Please try again."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  // Update project fields
  function handleProjectChange(e) {
    const { name, value } = e.target;

    setProjectForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Open new project form
  function addProject() {
    setProjectForm({ ...emptyProject });
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  // Open existing project for editing
  function editProject(project) {
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies || "",
      githubUrl: project.githubUrl || "",
      liveDemoUrl: project.liveDemoUrl || "",
    });

    setEditingId(project.id);
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Add or update project
  async function saveProject(e) {
    e.preventDefault();

    setSavingProject(true);
    setMessage("");
    setError("");

    try {
      if (editingId !== null) {
        await api.put(`/projects/${editingId}`, projectForm);
      } else {
        await api.post("/projects", projectForm);
      }

      const response = await api.get("/projects/my");

      setProjects(
        Array.isArray(response.data) ? response.data : []
      );

      setMessage(
        editingId !== null
          ? "Project updated successfully!"
          : "Project added successfully!"
      );

      setProjectForm({ ...emptyProject });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Saving project failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save your project. Please try again."
      );
    } finally {
      setSavingProject(false);
    }
  }

  // Delete project
  async function deleteProject(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/projects/${id}`);

      setProjects((previous) =>
        previous.filter((project) => project.id !== id)
      );

      setMessage("Project deleted successfully!");
    } catch (err) {
      console.error("Deleting project failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete the project. Please try again."
      );
    }
  }

  // Cancel project form
  function cancelProject() {
    setShowForm(false);
    setEditingId(null);
    setProjectForm({ ...emptyProject });
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Page Header */}
      <header className="profile-header">
        <div>
          <p className="profile-eyebrow">YOUR SPACE</p>

          <h1>My Profile & Portfolio</h1>

          <p className="profile-subtitle">
            Showcase your skills, projects, and achievements in one place.
          </p>
        </div>

        <div className="profile-header-icon">
          <UserRound size={35} />
        </div>
      </header>

      {/* Success and Error Messages */}
      {message && (
        <div className="profile-message success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="profile-message error-message">
          {error}
        </div>
      )}

      {/* Professional Links */}
      <section className="profile-section">
        <div className="profile-section-heading">
          <div className="section-icon">
            <Globe size={22} />
          </div>

          <div>
            <h2>Professional Links</h2>
            <p>
              Add your profiles so others can explore your work.
            </p>
          </div>
        </div>

        <form onSubmit={saveProfile}>
          <div className="profile-links-grid">
            <div className="profile-field">
              <label htmlFor="githubUrl">
                <Code size={17} />
                GitHub Profile
              </label>

              <input
                id="githubUrl"
                type="url"
                name="githubUrl"
                value={profile.githubUrl ?? ""}
                onChange={handleProfileChange}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="linkedinUrl">
                <UserRound size={17} />
                LinkedIn Profile
              </label>

              <input
                id="linkedinUrl"
                type="url"
                name="linkedinUrl"
                value={profile.linkedinUrl ?? ""}
                onChange={handleProfileChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="leetcodeUrl">
                <Code size={17} />
                LeetCode Profile
              </label>

              <input
                id="leetcodeUrl"
                type="url"
                name="leetcodeUrl"
                value={profile.leetcodeUrl ?? ""}
                onChange={handleProfileChange}
                placeholder="https://leetcode.com/username"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="portfolioUrl">
                <Globe size={17} />
                Personal Portfolio
              </label>

              <input
                id="portfolioUrl"
                type="url"
                name="portfolioUrl"
                value={profile.portfolioUrl ?? ""}
                onChange={handleProfileChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="profile-primary-button"
            disabled={savingProfile}
          >
            <Save size={17} />
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>

      {/* Projects Section */}
      <section className="profile-section projects-section">
        <div className="projects-heading">
          <div className="profile-section-heading">
            <div className="section-icon">
              <FolderKanban size={22} />
            </div>

            <div>
              <h2>My Projects</h2>
              <p>
                Showcase the projects you have built and the technologies
                you have learned.
              </p>
            </div>
          </div>

          {!showForm && (
            <button
              type="button"
              className="profile-primary-button add-project-button"
              onClick={addProject}
            >
              <Plus size={18} />
              Add Project
            </button>
          )}
        </div>

        {/* Add or Edit Project Form */}
        {showForm && (
          <form className="project-form" onSubmit={saveProject}>
            <div className="project-form-heading">
              <h3>
                {editingId !== null
                  ? "Edit Project"
                  : "Add a New Project"}
              </h3>

              <button
                type="button"
                className="profile-close-button"
                onClick={cancelProject}
                aria-label="Close project form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="project-form-grid">
              <div className="profile-field full-width">
                <label htmlFor="projectTitle">
                  Project Title *
                </label>

                <input
                  id="projectTitle"
                  type="text"
                  name="title"
                  value={projectForm.title}
                  onChange={handleProjectChange}
                  placeholder="Student Activity Hub"
                  maxLength={200}
                  required
                />
              </div>

              <div className="profile-field full-width">
                <label htmlFor="projectDescription">
                  Description
                </label>

                <textarea
                  id="projectDescription"
                  name="description"
                  value={projectForm.description}
                  onChange={handleProjectChange}
                  placeholder="Describe what your project does..."
                  rows={4}
                />
              </div>

              <div className="profile-field full-width">
                <label htmlFor="projectTechnologies">
                  Technologies Used
                </label>

                <input
                  id="projectTechnologies"
                  type="text"
                  name="technologies"
                  value={projectForm.technologies}
                  onChange={handleProjectChange}
                  placeholder="Java, Spring Boot, React, MySQL"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="projectGithub">
                  <Code size={17} />
                  GitHub Repository
                </label>

                <input
                  id="projectGithub"
                  type="url"
                  name="githubUrl"
                  value={projectForm.githubUrl}
                  onChange={handleProjectChange}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="profile-field">
                <label htmlFor="projectDemo">
                  <Globe size={17} />
                  Live Demo
                </label>

                <input
                  id="projectDemo"
                  type="url"
                  name="liveDemoUrl"
                  value={projectForm.liveDemoUrl}
                  onChange={handleProjectChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="project-form-actions">
              <button
                type="button"
                className="profile-secondary-button"
                onClick={cancelProject}
                disabled={savingProject}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="profile-primary-button"
                disabled={savingProject}
              >
                <Save size={17} />

                {savingProject
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Project"
                    : "Save Project"}
              </button>
            </div>
          </form>
        )}

        {/* Project Cards */}
        {projects.length === 0 ? (
          <div className="empty-projects">
            <div className="empty-project-icon">
              <FolderKanban size={35} />
            </div>

            <h3>No projects added yet</h3>

            <p>
              Add your first project to start building your portfolio.
            </p>

            {!showForm && (
              <button
                type="button"
                className="profile-primary-button"
                onClick={addProject}
              >
                <Plus size={18} />
                Add Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="project-cards-grid">
            {projects.map((project) => (
              <article
                className="portfolio-project-card"
                key={project.id}
              >
                <div className="project-card-top">
                  <div className="project-card-icon">
                    <FolderKanban size={23} />
                  </div>

                  <div className="project-card-actions">
                    <button
                      type="button"
                      onClick={() => editProject(project)}
                      title="Edit project"
                      aria-label={`Edit ${project.title}`}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      title="Delete project"
                      aria-label={`Delete ${project.title}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h3>{project.title}</h3>

                <p className="project-card-description">
                  {project.description ||
                    "No description added for this project."}
                </p>

                {project.technologies && (
                  <div className="project-technologies">
                    {project.technologies
                      .split(",")
                      .map((technology, index) => (
                        <span key={`${technology}-${index}`}>
                          {technology.trim()}
                        </span>
                      ))}
                  </div>
                )}

                <div className="project-card-links">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Code size={16} />
                      GitHub
                      <ExternalLink size={13} />
                    </a>
                  )}

                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe size={16} />
                      Live Demo
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;