import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/Chatroom.css";
import { useNavigate } from "react-router-dom";

const VITE_PORT = import.meta.env.VITE_PORT;
const WEBSOCKET_URL = `ws://localhost:${VITE_PORT}`;
const API_BASE_URL = `http://localhost:${VITE_PORT}/api`;


const Chatroom = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  // State
  const [groupName, setGroupName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("guest");
  const [usernameLoading, setUsernameLoading] = useState(true);

  // Refs
  const ws = useRef(null);
  const messagesContainerRef = useRef(null);
  const usernameRef = useRef(username);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.name || "guest");
      } catch {
        setUsername("guest");
      } finally {
        setUsernameLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch group info (name)
  useEffect(() => {
    if (!groupId) return;
    const fetchGroupName = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupName(res.data.name || "Unknown Group");
      } catch (error) {
        console.error("Error fetching group info:", error);
        setGroupName("Unknown Group");
      }
    };
    fetchGroupName();
  }, [groupId]);

  // Connect to WebSocket
  useEffect(() => {
    if (usernameLoading || !groupId) return;
    ws.current = new WebSocket(`${WEBSOCKET_URL}?groupId=${groupId}`);

    ws.current.onopen = () => {
      console.log(`Connected to WebSocket for group ${groupId}`);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.current?.close();
    };
  }, [groupId, usernameLoading]);

  // Fetch messages when groupId changes
  useEffect(() => {
    if (!groupId) return;
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/groups/${groupId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [groupId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (usernameLoading || !input.trim()) return;
    if (ws.current?.readyState === WebSocket.OPEN) {
      const message = {
        username: usernameRef.current,
        text: input.trim(),
        createdAt: new Date(),
        groupId,
      };
      ws.current.send(JSON.stringify(message));
      setInput("");
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatroom-container">
     <div className="chat-header">
  <button
    className="back-button"
    onClick={() => navigate(`/group/${groupId}`)}
    aria-label="Go back"
  >
    Back
  </button>
  <h2>{groupName}</h2>
  {usernameLoading && <p>Loading user info...</p>}
</div>


      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((msg, i) => {
          const currentDate = new Date(msg.createdAt);
          const currentDateString = currentDate.toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const prevMsg = messages[i - 1];
          let showDateSeparator = false;
          if (i === 0) {
            showDateSeparator = true;
          } else {
            const prevDateString = new Date(
              prevMsg.createdAt
            ).toLocaleDateString([], {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            if (currentDateString !== prevDateString) {
              showDateSeparator = true;
            }
          }

          return (
            <React.Fragment key={i}>
              {showDateSeparator && (
                <div className="date-separator">
                  <span>{currentDateString}</span>
                </div>
              )}
              <div
                className={`message-wrapper ${
                  msg.username === username ? "right" : "left"
                }`}
              >
                <div
                  className={`message-bubble ${
                    msg.username === username ? "own" : "other"
                  }`}
                >
                  <div className="message-sender">{msg.username}</div>
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {currentDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder={
            usernameLoading ? "Loading user info..." : "Type your message..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={usernameLoading}
        />
        <button
          onClick={sendMessage}
          disabled={usernameLoading || !input.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chatroom;
