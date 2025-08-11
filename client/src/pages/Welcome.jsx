import React, { useState, useEffect } from "react";
import "../styles/Welcome.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";

const WelcomePage = () => {
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem("groups");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to see your groups.");
          setGroups([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:5001/api/groups/my-groups",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedGroups = Array.isArray(res.data) ? res.data : [];
        setGroups(fetchedGroups);
        localStorage.setItem("groups", JSON.stringify(fetchedGroups));
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Create group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      setCreating(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a group.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5001/api/groups",
        { name: newGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedGroups = [...groups, res.data];
      setGroups(updatedGroups);
      localStorage.setItem("groups", JSON.stringify(updatedGroups));
      setNewGroupName("");
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Could not create group.");
    } finally {
      setCreating(false);
    }
  };

  // Join via invite link
  const handleJoinGroup = async () => {
    if (!inviteLink.trim()) return;

    try {
      setJoining(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to join a group.");
        return;
      }

      // Extract invite code (supports full link or just code)
      let inviteCode = inviteLink.trim();
      if (inviteCode.includes("/")) {
        inviteCode = inviteCode.split("/").pop();
      }

      const res = await axios.post(
        `http://localhost:5001/api/groups/join/${inviteCode}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedGroups = [...groups, res.data.group];
      setGroups(updatedGroups);
      localStorage.setItem("groups", JSON.stringify(updatedGroups));
      setInviteLink("");
      setShowJoinForm(false);
    } catch (err) {
      console.error("Error joining group:", err);
      alert(
        err.response?.data?.message ||
          "Could not join group. Please check your invite link."
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="welcome-container">
        <header className="welcome-header">
          <h1>Welcome!</h1>
          <p className="welcome-subtext">
            Create or join a group to get started
          </p>
        </header>

        <main className="group-content">
          <div className="group-header">
            <h2>Your Groups</h2>

            {/* Create button */}
            {!showCreateForm ? (
              <button
                className="plus-btn"
                title="Create New Group"
                onClick={() => {
                  setShowCreateForm(true);
                  setShowJoinForm(false);
                }}
              >
                ➕
              </button>
            ) : (
              <div className="inline-form">
                <input
                  type="text"
                  placeholder="Enter group name..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="inline-input"
                />
                <button onClick={handleCreateGroup} disabled={creating}>
                  {creating ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewGroupName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Join button */}
            {!showJoinForm ? (
              <button
                className="join-btn"
                title="Join via Invite Link"
                onClick={() => {
                  setShowJoinForm(true);
                  setShowCreateForm(false);
                }}
              >
                🔗 Join
              </button>
            ) : (
              <div className="inline-form">
                <input
                  type="text"
                  placeholder="Paste invite link..."
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                  className="inline-input"
                />
                <button onClick={handleJoinGroup} disabled={joining}>
                  {joining ? "Joining..." : "Join"}
                </button>
                <button
                  onClick={() => {
                    setShowJoinForm(false);
                    setInviteLink("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Groups list */}
          {loading ? (
            <p className="loading-text">Loading your groups...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : groups.length > 0 ? (
            <ul className="group-list">
              {groups.map((group) => (
                <li key={group._id} className="group-item">
                  <Link to={`/group/${group._id}`}>{group.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-groups">
              You haven't joined or created any groups yet.
            </p>
          )}
        </main>
      </div>
    </>
  );
};

export default WelcomePage;
