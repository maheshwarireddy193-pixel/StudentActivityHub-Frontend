
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import "../App.css";

export default function LandingPage() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              YOUR JOURNEY. YOUR ACHIEVEMENTS.
            </div>

            <h1>
              Every achievement
              <br />
              has a <span>story.</span>
            </h1>

            <p className="hero-description">
              Your college journey is more than a degree.
              Bring your certificates, activities, and accomplishments
              together in one place—and turn your progress into
              opportunities for the future.
            </p>

            <div className="hero-actions">
              <a href="/register" className="primary-button">
                Start your journey <ArrowRight size={18} />
              </a>
              <a href="#how-it-works" className="secondary-button">
                Discover how it works
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-icon">
                <ShieldCheck size={19} />
              </div>
              <div>
                <strong>Your achievements, organized.</strong>
                <p>A clearer way to track your college journey.</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-label">
              <span>YOUR JOURNEY, DOCUMENTED</span>
              <span className="visual-label-dot" />
            </div>

            <div className="visual-image">
              <div className="image-caption">
                <span className="caption-kicker">
                  BEYOND THE CLASSROOM
                </span>
                <h2>
                  Make every
                  <br />
                  experience count.
                </h2>
              </div>

              <div className="floating-note">
                <div className="floating-icon">
                  <Award size={21} />
                </div>
                <div>
                  <span className="note-label">YOUR NEXT CHAPTER</span>
                  <strong>Starts with one achievement.</strong>
                </div>
              </div>
            </div>

            <div className="visual-footer">
              <span>01 — COLLECT</span>
              <span>02 — VERIFY</span>
              <span>03 — GROW</span>
            </div>
          </div>
        </section>

        <section className="intro-strip" id="about">
          <div className="intro-heading">
            <span className="section-label">A BETTER WAY FORWARD</span>
            <h2>
              Your hard work deserves
              <br />
              more than a forgotten folder.
            </h2>
          </div>
          <p>
            From workshops and internships to technical achievements,
            keep your college accomplishments organized, accessible,
            and ready for your next opportunity.
          </p>
        </section>

        <section className="features-section" id="features">
          <div className="section-top">
            <div>
              <span className="section-label">
                BUILT AROUND YOUR JOURNEY
              </span>
              <h2>Everything in its place.</h2>
            </div>
            <span className="section-number">01 / 03</span>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">
                <BookOpen size={23} />
              </div>
              <span className="feature-index">01</span>
              <h3>Your activities, organized.</h3>
              <p>
                Keep your workshops, internships, certifications,
                and extracurricular activities together in one space.
              </p>
              <div className="feature-bottom">
                <span>ACTIVITY MANAGEMENT</span>
                <ArrowUpRight size={18} />
              </div>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <CheckCircle2 size={23} />
              </div>
              <span className="feature-index">02</span>
              <h3>Verification with clarity.</h3>
              <p>
                Submit certificates and follow their verification
                status while faculty review your achievements.
              </p>
              <div className="feature-bottom">
                <span>CERTIFICATE VERIFICATION</span>
                <ArrowUpRight size={18} />
              </div>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <Sparkles size={23} />
              </div>
              <span className="feature-index">03</span>
              <h3>Build your next opportunity.</h3>
              <p>
                Bring your skills, projects, and achievements into
                an AI-assisted resume you can generate and download.
              </p>
              <div className="feature-bottom">
                <span>AI RESUME BUILDER</span>
                <ArrowUpRight size={18} />
              </div>
            </article>
          </div>
        </section>

        <section className="workflow-section" id="how-it-works">
          <div className="workflow-heading">
            <span className="section-label">SIMPLE BY DESIGN</span>
            <h2>
              Three steps.
              <br />
              A clearer picture of you.
            </h2>
          </div>

          <div className="workflow-list">
            <article className="workflow-item">
              <span className="workflow-number">01</span>
              <div>
                <h3>Collect your experiences</h3>
                <p>Add activities and upload supporting certificates.</p>
              </div>
              <ArrowUpRight size={20} />
            </article>

            <article className="workflow-item">
              <span className="workflow-number">02</span>
              <div>
                <h3>Get your achievements verified</h3>
                <p>Track reviews and submission status.</p>
              </div>
              <ArrowUpRight size={20} />
            </article>

            <article className="workflow-item">
              <span className="workflow-number">03</span>
              <div>
                <h3>Present your potential</h3>
                <p>
                  Use your achievements to help build a professional
                  resume.
                </p>
              </div>
              <ArrowUpRight size={20} />
            </article>
          </div>
        </section>

        <section className="closing-section">
          <div>
            <span className="section-label">
              YOUR NEXT CHAPTER STARTS HERE
            </span>
            <h2>
              Start collecting
              <br />
              what makes you, <em>you.</em>
            </h2>
          </div>
          <a href="/register" className="closing-button">
            Create your account <ArrowRight size={18} />
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="footer-brand" href="/">
          Student Activity Hub
        </a>
        <p>Every achievement has a story.</p>
        <span>© 2026 Student Activity Hub</span>
      </footer>
    </div>
  );
}
