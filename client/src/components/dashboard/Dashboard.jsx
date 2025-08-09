import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios to make requests
import '../../styles/Dashboard.css';
import Navbar from '../Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);  // state for user info
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // redirect if no token
          return;
        }

        const res = await axios.get('http://localhost:5001/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStudent(res.data); // set user info from backend
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        handleLogout(); // logout on error
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <header
          className="dashboard-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <h1>Student Dashboard</h1>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="notification-btn">
              <span className="icon">🔔</span>
              <span className="badge">2</span>
            </button>
            <button className="profile-btn">
              <img src={student.picture || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="Profile" className="avatar" />
            </button>
            <button
              onClick={handleLogout}
              style={{
                cursor: 'pointer',
                padding: '6px 12px',
                backgroundColor: '#d9534f',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="student-profile">
            <div className="profile-header">
              <img src={student.picture || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="Student" className="profile-avatar" />
              <div className="profile-info">
                <h2>{student.name}</h2>
                <p className="college"> {/* you can add this field in your user schema if needed */} </p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-card">
                <h3>Contact Information</h3>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{student.email}</span>
                </div>
                {/* Add phone if you store it */}
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

          {/* rest of dashboard content */}
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
