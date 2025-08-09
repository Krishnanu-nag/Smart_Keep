import React from 'react';
import '../styles/Welcome.css'; 
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';

const WelcomePage = () => {
  return (
    <>
    <Navbar />
    <div className="welcome-container">
      <header className="welcome-header">
        <div className="welcome-message">
          <h1>Welcome back!</h1>
          <p className="welcome-subtext">We're glad to see you again</p>
        </div>
        <button className="notification-bell">
          <span className="bell-icon">🔔</span>
          <span className="notification-count">3</span>
        </button>
      </header>

      <main className="welcome-content">
        <section className="quick-stats">
          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <p className="stat-value">24</p>
            <p className="stat-change">+5 from last week</p>
          </div>
          <div className="stat-card">
            <h3>Projects</h3>
            <p className="stat-value">7</p>
            <p className="stat-change">2 ongoing</p>
          </div>
          <div className="stat-card">
            <h3>Messages</h3>
            <p className="stat-value">12</p>
            <p className="stat-change">3 unread</p>
          </div>
        </section>

        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            <li>
              <span className="activity-icon">✓</span>
              <span>Completed task "Design welcome page"</span>
              <span className="activity-time">2 hours ago</span>
            </li>
            <li>
              <span className="activity-icon">✉️</span>
              <span>Received message from Sarah</span>
              <span className="activity-time">5 hours ago</span>
            </li>
            <li>
              <span className="activity-icon">+</span>
              <span>Started new project "Marketing Campaign"</span>
              <span className="activity-time">Yesterday</span>
            </li>
          </ul>
        </section>
      </main>

      <footer className="welcome-footer">
        <Link to="/dashboard">
        <button className="primary-action">Continue to Dashboard</button>
        </Link>
        <div className="footer-links">
          <a href="#">Help Center</a>
          <a href="#">Settings</a>
          <a href="#">Feedback</a>
        </div>
      </footer>
    </div>
    </>
  );
};

export default WelcomePage;