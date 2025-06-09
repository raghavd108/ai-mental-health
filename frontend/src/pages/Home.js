import React from "react";
import { Link } from "react-router-dom";
import "../css/HomePage.css"; // Ensure your styles are imported

export default function Home() {
  return (
    <>
      {/* Hero Section with background image */}
      <div className="hero-container">
        <div className="hero-content">
          <h1>Welcome to Your AI Mental Health Companion</h1>
          <p>Track your mood, get therapy, and discover emotional insights.</p>

          <nav>
            <Link to="/therapy">Start Therapy Session</Link>
          </nav>
        </div>
      </div>

      {/* Informational Sections on dark boxes */}
      <div className="info-section">
        <div className="section-card">
          <div className="text-content">
            <h2>About Us</h2>
            <p>
              We are dedicated to providing accessible and intelligent mental
              health support using AI-driven therapy tools.
            </p>
          </div>
          <div className="image-block">
            <img src="/images/about.webp" alt="About Us" />
          </div>
        </div>

        <div className="section-card">
          <div className="text-content">
            <h2>How We Work</h2>
            <p>
              Through voice, facial expressions, and body language analysis, our
              AI therapist adapts to your emotions in real time.
            </p>
          </div>
          <div className="image-block">
            <img src="/images/how.webp" alt="How We Work" />
          </div>
        </div>

        <div className="section-card">
          <div className="text-content">
            <h2>Why Therapy Matters</h2>
            <p>
              Mental well-being impacts every part of life. Early and consistent
              emotional care helps prevent long-term issues.
            </p>
          </div>
          <div className="image-block">
            <img src="/images/why.jpeg" alt="Why Therapy" />
          </div>
        </div>
      </div>
    </>
  );
}
