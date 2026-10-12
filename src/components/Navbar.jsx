import { ArrowUpRight, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link
          className="brand"
          to="/"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">
            <BookOpen size={21} strokeWidth={1.8} />
          </span>

          <span className="brand-name">
            student<span className="brand-light">activity</span>
            <span className="brand-hub">HUB</span>
          </span>
        </Link>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <button
            type="button"
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("how-it-works")}
          >
            How it works
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>

          <div className="mobile-nav-actions">
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Log in
            </Link>

            <Link
              className="nav-cta"
              to="/register"
              onClick={() => setMenuOpen(false)}
            >
              Get started <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="login-link">
            Log in
          </Link>

          <Link to="/register" className="nav-cta">
            Get started <ArrowUpRight size={16} />
          </Link>
        </div>

        <button
          type="button"
          className="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
    </header>
  );
}