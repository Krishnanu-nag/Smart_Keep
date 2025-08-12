import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // ✅ Fetch user profile
        const resUser = await axios.get(`${import.meta.env.VITE_FRONTEND_URI}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(resUser.data);

        // ✅ Fetch groups for logged-in user
        const resGroups = await axios.get(
        `${import.meta.env.VITE_FRONTEND_URI}/api/groups/my-groups`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setGroups(resGroups.data || []);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        handleLogout();
      }
    };

    fetchData();
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
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Student Dashboard</h1>
          <div
            className="header-actions"
            style={{ display: "flex", alignItems: "center", gap: "15px" }}
          >
            <button
              onClick={handleLogout}
              style={{
                cursor: "pointer",
                padding: "6px 12px",
                backgroundColor: "#d9534f",
                border: "none",
                borderRadius: "4px",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="student-profile">
            <div className="profile-header">
              <img
                src={student.picture ? student.picture : "images/user.png"}
                className="profile-avatar"
              />

              <div className="profile-info">
                <h2>{student.name}</h2>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-card">
                <h3>Contact Information</h3>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{student.email}</span>
                </div>
              </div>

              <div className="detail-card">
                <h3>Groups currenty presnt in :</h3>
                {groups.length > 0 ? (
                  <ul className="groups-list">
                    {groups.map((group, index) => (
                      <li key={group._id || index} className="group-item">
                        {group.name || "Unnamed Group"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="placeholder">No groups joined yet</p>
                )}
              </div>

              <div className="detail-card coming-soon">
                <h3>Academic Information</h3>
                <p className="placeholder">Feature coming soon</p>
              </div>
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
