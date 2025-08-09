import React from 'react';
import '../../styles/Dashboard.css'
import Navbar from '../Navbar';

const Dashboard = () => {
  // Dummy student data - will be replaced with real data later
  const student = {
    name: "Alex Johnson",
    email: "alex.johnson@example.edu",
    phone: "(555) 123-4567",
    college: "State University",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  return (
    <>
    <Navbar />
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="header-actions">
          <button className="notification-btn">
            <span className="icon">🔔</span>
            <span className="badge">2</span>
          </button>
          <button className="profile-btn">
            <img src={student.avatar} alt="Profile" className="avatar" />
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="student-profile">
          <div className="profile-header">
            <img src={student.avatar} alt="Student" className="profile-avatar" />
            <div className="profile-info">
              <h2>{student.name}</h2>
              <p className="college">{student.college}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-card">
              <h3>Contact Information</h3>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{student.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{student.phone}</span>
              </div>
            </div>

            <div className="detail-card coming-soon">
              <h3>Academic Information</h3>
              <p className="placeholder">Feature coming soon</p>
            </div>

            <div className="detail-card coming-soon">
              <h3>Course Schedule</h3>
              <p className="placeholder">Feature coming soon</p>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">
              <span className="action-icon">📚</span>
              View Courses
            </button>
            <button className="action-btn">
              <span className="action-icon">📝</span>
              Add Information
            </button>
            <button className="action-btn">
              <span className="action-icon">🔄</span>
              Update Profile
            </button>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>© 2023 Student Portal</p>
        <div className="footer-links">
          <a href="#">Help</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Dashboard;