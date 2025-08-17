import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import "../../styles/Group.css";

const Group = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_FRONTEND_URI}/api/groups/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGroup(res.data);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching the group."
        );
        setGroup(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleCopy = () => {
    if (group?.inviteLink) {
      navigator.clipboard.writeText(group.inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!group) return <p className="error-text">Group not found</p>;

  return (
    <>
      <Navbar />
      <div className="group-container">
        <button className="btn back-btn" onClick={() => navigate("/welcome")}>
          &larr; Back
        </button>

        <h2 className="group-title">{group.name}</h2>

        <div className="invite-code">
          <b>Group Code:</b>
          <div className="invite-flex">
            <p>{group.inviteLink}</p>
            <button className="btn copy-btn" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <h3 className="members-title">Members:</h3>
        <ul className="members-list">
          {Array.isArray(group.members) && group.members.length > 0 ? (
            group.members.map((member) => (
              <li key={member.userId._id} className="member-item">
                {member.userId.name}
              </li>
            ))
          ) : (
            <li className="member-item">No members found</li>
          )}
        </ul>

        <button
          className="btn chat-btn"
          onClick={() => {
            navigate(`/group/${groupId}/chat`);
          }}
        >
          Chat
        </button>
      </div>
    </>
  );
};

export default Group;
