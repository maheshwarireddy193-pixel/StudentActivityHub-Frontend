import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  User,
  GraduationCap,
  BriefcaseBusiness,
  Code,
  Award,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import "./ResumeBuilder.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  objective: "",
  college: "",
  degree: "B.Tech",
  branch: "",
  graduationYear: "",
  cgpa: "",
  skills: "",
  projects: [{ title: "", technologies: "", description: "", link: "" }],
  internships: [{ company: "", role: "", duration: "", description: "" }],
  certifications: [""],
  achievements: "",
};

export default function ResumeBuilder() {
  const [form, setForm] = useState(initialForm);
  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index
          ? typeof item === "string"
            ? value
            : { ...item, [key]: value }
          : item
      ),
    }));
  };

  const addItem = (field, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], emptyItem],
    }));
  };

  const removeItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const downloadPDF = () => {
  window.print();
  
};

  const SectionTitle = ({ icon: Icon, children }) => (
    <h3 className="rb-section-title">
      <Icon size={19} />
      {children}
    </h3>
  );

  const Field = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
  }) => (
    <label className="rb-field">
      <span>
        {label}
        {required && <b className="rb-required"> *</b>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        required={required}
      />
    </label>
  );

  return (
    <div className="rb-page">
      <header className="rb-header">
        <Link to="/dashboard" className="rb-back">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="rb-brand">
          <FileText size={23} />
          <span>Resume Builder</span>
        </div>

        <button className="rb-download" onClick={downloadPDF}>
          <Download size={17} />
          Download PDF
        </button>
      </header>

      <main className="rb-main">
        <div className="rb-heading">
          <div>
            <span className="rb-eyebrow">YOUR CAREER STARTS HERE</span>
            <h1>Build your professional resume.</h1>
            <p>
              Add your education, skills, projects and achievements to create
              a resume you can share with recruiters.
            </p>
          </div>

          <div className="rb-heading-icon">
            <FileText size={37} />
          </div>
        </div>

        <div className="rb-layout">
          <section className="rb-form-panel">
            <div className="rb-panel-heading">
              <div>
                <h2>Resume details</h2>
                <p>Fill in the sections below.</p>
              </div>
              <span className="rb-live-badge">LIVE EDITOR</span>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <SectionTitle icon={User}>Personal information</SectionTitle>

              <div className="rb-grid">
                <Field
                  label="Full name"
                  value={form.name}
                  onChange={(v) => updateField("name", v)}
                  placeholder="Your full name"
                  required
                />

                <Field
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                  placeholder="you@example.com"
                  required
                />

                <Field
                  label="Phone number"
                  value={form.phone}
                  onChange={(v) => updateField("phone", v)}
                  placeholder="+91 XXXXX XXXXX"
                />

                <Field
                  label="Location"
                  value={form.location}
                  onChange={(v) => updateField("location", v)}
                  placeholder="City, State"
                />

                <Field
                  label="LinkedIn profile"
                  value={form.linkedin}
                  onChange={(v) => updateField("linkedin", v)}
                  placeholder="https://linkedin.com/in/..."
                />

                <Field
                  label="GitHub profile"
                  value={form.github}
                  onChange={(v) => updateField("github", v)}
                  placeholder="https://github.com/..."
                />
              </div>

              <SectionTitle icon={FileText}>Career objective</SectionTitle>

              <label className="rb-field">
                <span>Professional summary</span>
                <textarea
                  rows="4"
                  value={form.objective}
                  onChange={(e) => updateField("objective", e.target.value)}
                  placeholder="Write a short summary about your career goals, strengths and interests..."
                />
              </label>

              <SectionTitle icon={GraduationCap}>Education</SectionTitle>

              <div className="rb-grid">
                <Field
                  label="College / University"
                  value={form.college}
                  onChange={(v) => updateField("college", v)}
                  placeholder="College name"
                />

                <label className="rb-field">
                  <span>Degree</span>
                  <select
                    value={form.degree}
                    onChange={(e) => updateField("degree", e.target.value)}
                  >
                    <option>B.Tech</option>
                    <option>B.E.</option>
                    <option>B.Sc.</option>
                    <option>BCA</option>
                    <option>M.Tech</option>
                    <option>MCA</option>
                    <option>Other</option>
                  </select>
                </label>

                <Field
                  label="Branch / Specialization"
                  value={form.branch}
                  onChange={(v) => updateField("branch", v)}
                  placeholder="e.g. AI & ML"
                />

                <Field
                  label="Graduation year"
                  value={form.graduationYear}
                  onChange={(v) => updateField("graduationYear", v)}
                  placeholder="e.g. 2028"
                />

                <Field
                  label="CGPA / Percentage"
                  value={form.cgpa}
                  onChange={(v) => updateField("cgpa", v)}
                  placeholder="e.g. 8.5 CGPA"
                />
              </div>

              <SectionTitle icon={Code}>Technical skills</SectionTitle>

              <label className="rb-field">
                <span>Skills</span>
                <textarea
                  rows="3"
                  value={form.skills}
                  onChange={(e) => updateField("skills", e.target.value)}
                  placeholder="Java, Python, React, Spring Boot, MySQL..."
                />
                <small>Separate skills using commas.</small>
              </label>

              <SectionTitle icon={BriefcaseBusiness}>
                Projects
              </SectionTitle>

              {form.projects.map((project, index) => (
                <div className="rb-item-card" key={index}>
                  <div className="rb-item-top">
                    <b>Project {index + 1}</b>
                    {form.projects.length > 1 && (
                      <button
                        type="button"
                        className="rb-remove"
                        onClick={() => removeItem("projects", index)}
                        aria-label="Remove project"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <Field
                    label="Project title"
                    value={project.title}
                    onChange={(v) =>
                      updateArrayItem("projects", index, "title", v)
                    }
                    placeholder="Project name"
                  />

                  <Field
                    label="Technologies"
                    value={project.technologies}
                    onChange={(v) =>
                      updateArrayItem("projects", index, "technologies", v)
                    }
                    placeholder="React, Java, MySQL..."
                  />

                  <Field
                    label="GitHub repository / Project link"
                    value={project.link}
                    onChange={(v) =>
                      updateArrayItem("projects", index, "link", v)
                    }
                    placeholder="https://github.com/..."
                  />

                  <label className="rb-field">
                    <span>Project description</span>
                    <textarea
                      rows="3"
                      value={project.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "projects",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Explain what the project does and what you contributed..."
                    />
                  </label>
                </div>
              ))}

              <button
                type="button"
                className="rb-add"
                onClick={() =>
                  addItem("projects", {
                    title: "",
                    technologies: "",
                    description: "",
                    link: "",
                  })
                }
              >
                <Plus size={17} /> Add another project
              </button>

              <SectionTitle icon={BriefcaseBusiness}>
                Internships / Experience
              </SectionTitle>

              {form.internships.map((internship, index) => (
                <div className="rb-item-card" key={index}>
                  <div className="rb-item-top">
                    <b>Experience {index + 1}</b>
                    {form.internships.length > 1 && (
                      <button
                        type="button"
                        className="rb-remove"
                        onClick={() => removeItem("internships", index)}
                        aria-label="Remove experience"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="rb-grid">
                    <Field
                      label="Organization"
                      value={internship.company}
                      onChange={(v) =>
                        updateArrayItem("internships", index, "company", v)
                      }
                      placeholder="Company name"
                    />

                    <Field
                      label="Role"
                      value={internship.role}
                      onChange={(v) =>
                        updateArrayItem("internships", index, "role", v)
                      }
                      placeholder="Intern / Developer..."
                    />

                    <Field
                      label="Duration"
                      value={internship.duration}
                      onChange={(v) =>
                        updateArrayItem("internships", index, "duration", v)
                      }
                      placeholder="e.g. May–June 2026"
                    />
                  </div>

                  <label className="rb-field">
                    <span>Responsibilities / Learning</span>
                    <textarea
                      rows="3"
                      value={internship.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "internships",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe your experience and contributions..."
                    />
                  </label>
                </div>
              ))}

              <button
                type="button"
                className="rb-add"
                onClick={() =>
                  addItem("internships", {
                    company: "",
                    role: "",
                    duration: "",
                    description: "",
                  })
                }
              >
                <Plus size={17} /> Add experience
              </button>

              <SectionTitle icon={Award}>Certifications</SectionTitle>

              {form.certifications.map((certificate, index) => (
                <div className="rb-inline-item" key={index}>
                  <input
                    value={certificate}
                    onChange={(e) =>
                      updateArrayItem(
                        "certifications",
                        index,
                        null,
                        e.target.value
                      )
                    }
                    placeholder="Certification name"
                  />

                  {form.certifications.length > 1 && (
                    <button
                      type="button"
                      className="rb-remove"
                      onClick={() => removeItem("certifications", index)}
                      aria-label="Remove certification"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="rb-add"
                onClick={() => addItem("certifications", "")}
              >
                <Plus size={17} /> Add certification
              </button>

              <SectionTitle icon={Award}>Achievements</SectionTitle>

              <label className="rb-field">
                <span>Achievements and awards</span>
                <textarea
                  rows="3"
                  value={form.achievements}
                  onChange={(e) => updateField("achievements", e.target.value)}
                  placeholder="Hackathons, awards, leadership, competitions..."
                />
              </label>

              <div className="rb-form-actions">
                <button
                  type="button"
                  className="rb-preview-button"
                  onClick={() => setShowPreview((prev) => !prev)}
                >
                  <Eye size={17} />
                  {showPreview ? "Hide preview" : "Preview resume"}
                </button>

                <button
                  type="button"
                  className="rb-download"
                  onClick={downloadPDF}
                >
                  <Download size={17} />
                  Print / Save PDF
                </button>
              </div>
            </form>
          </section>

          <aside className={`rb-preview-panel ${showPreview ? "rb-preview-open" : ""}`}>
            <div className="rb-preview-heading">
              <div>
                <span className="rb-eyebrow">LIVE PREVIEW</span>
                <h2>Your resume</h2>
              </div>
              <Eye size={21} />
            </div>

            <ResumePreview form={form} />
          </aside>
        </div>
      </main>
    </div>
  );
}

function ResumePreview({ form }) {
  const hasProjects = form.projects.some(
    (project) => project.title.trim() || project.description.trim()
  );

  const hasInternships = form.internships.some(
    (item) => item.company.trim() || item.role.trim()
  );

  const certifications = form.certifications.filter((item) => item.trim());

  const skills = form.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <article className="rb-paper">
      <div className="rb-resume-header">
        <h1>{form.name || "Your Name"}</h1>

        <div className="rb-contact-line">
          {[form.email, form.phone, form.location].filter(Boolean).join(" | ")}
        </div>

        <div className="rb-contact-line">
          {[form.linkedin, form.github].filter(Boolean).join(" | ")}
        </div>
      </div>

      {form.objective.trim() && (
        <section className="rb-resume-section">
          <h3>CAREER OBJECTIVE</h3>
          <p>{form.objective}</p>
        </section>
      )}

      {(form.college || form.branch || form.graduationYear || form.cgpa) && (
        <section className="rb-resume-section">
          <h3>EDUCATION</h3>
          <b>{form.college || "College / University"}</b>
          <p>
            {[form.degree, form.branch].filter(Boolean).join(" — ")}
          </p>
          <p>
            {[form.graduationYear, form.cgpa && `CGPA: ${form.cgpa}`]
              .filter(Boolean)
              .join(" | ")}
          </p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="rb-resume-section">
          <h3>TECHNICAL SKILLS</h3>
          <p>{skills.join(" • ")}</p>
        </section>
      )}

      {hasProjects && (
        <section className="rb-resume-section">
          <h3>PROJECTS</h3>

          {form.projects
            .filter((project) => project.title.trim() || project.description.trim())
            .map((project, index) => (
              <div className="rb-resume-item" key={index}>
                <b>{project.title || "Project"}</b>

                {project.technologies && (
                  <p>
                    <i>Technologies: {project.technologies}</i>
                  </p>
                )}

                {project.description && <p>{project.description}</p>}

                {project.link && <p>Repository: {project.link}</p>}
              </div>
            ))}
        </section>
      )}

      {hasInternships && (
        <section className="rb-resume-section">
          <h3>EXPERIENCE</h3>

          {form.internships
            .filter((item) => item.company.trim() || item.role.trim())
            .map((item, index) => (
              <div className="rb-resume-item" key={index}>
                <b>{item.role || "Role"}</b>
                {item.company && <p>{item.company}</p>}
                {item.duration && <p>{item.duration}</p>}
                {item.description && <p>{item.description}</p>}
              </div>
            ))}
        </section>
      )}

      {certifications.length > 0 && (
        <section className="rb-resume-section">
          <h3>CERTIFICATIONS</h3>
          <ul>
            {certifications.map((certificate, index) => (
              <li key={index}>{certificate}</li>
            ))}
          </ul>
        </section>
      )}

      {form.achievements.trim() && (
        <section className="rb-resume-section">
          <h3>ACHIEVEMENTS</h3>
          <p>{form.achievements}</p>
        </section>
      )}

      <div className="rb-resume-footer">
        Generated with StudentActivityHub
      </div>
    </article>
  );
}