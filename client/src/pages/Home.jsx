import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleGetStartedClick = (e) => {
    if (token) {
      e.preventDefault();
      navigate('/welcome');
    }
  };

  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Smart Keep</h1>
          <p className="tagline">Achieve more together with your team</p>
          <div className="cta-buttons">
            <Link 
              to="/register" 
              className="btn primary" 
              onClick={handleGetStartedClick}
            >
              Get Started
            </Link>
            {!token && (
              <Link to="/login" className="btn secondary">Login</Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/goal-illustration.svg" alt="Team setting goals" />
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose Smart Keep?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">👥</div>
            <h3>Team Collaboration</h3>
            <p>Work together with your team to achieve shared objectives.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Visualize your progress with intuitive charts and metrics.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🔔</div>
            <h3>Real-time Updates</h3>
            <p>Get instant notifications when teammates make progress.</p>
          </div>
        </div>
      </section>

      <section className="demo-section">
        <h2>See It In Action</h2>
        <div className="demo-container">
          <img src="/images/app-screenshot.png" alt="App preview" className="demo-image" />
        </div>
      </section>

      <footer className="home-footer">
        <p>Ready to boost your productivity?</p>
        <Link to="/register" className="btn primary">Sign Up Free</Link>
      </footer>
    </div>
  );
};

export default Home;
