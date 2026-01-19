import { MdInfo } from "react-icons/md";
import "./Settings.scss";

export default function AboutSection() {
  return (
    <section className="settings-section about-section settings-card">
      <div className="settings-header-row">
        <MdInfo className="settings-section-icon" />
        <div>
          <h3>About</h3>
          <div className="settings-section-desc">
            App info, repository and contact details.
          </div>
        </div>
      </div>
      <div className="about-content">
        <div className="about-row">
          <span className="about-label">App version:</span>
          <span className="about-value">2.0.0</span>
        </div>
        <div className="about-row">
          <span className="about-label">Repository:</span>
          <a
            className="about-link"
            href="https://github.com/kcpru/todo2"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/kcpru/todo2
          </a>
        </div>
        <div className="about-row">
          <span className="about-label">Contact:</span>
          <a className="about-link" href="mailto:support@todo2.app">
            support@todo2.app
          </a>
        </div>
      </div>
    </section>
  );
}
