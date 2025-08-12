import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  async function handleCredentialResponse(response) {
    try {
      // Optional: decode just for logging
      const decoded = jwtDecode(response.credential);
      // console.log("Google User:", decoded);

      // Send credential to backend
     const res = await axios.post(
  `${import.meta.env.VITE_FRONTEND_URI}/api/google-login`,
  { credential: response.credential }
);


      // Store JWT + user in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect
      navigate("/welcome");
    } catch (error) {
      console.error("Google login failed", error);
    }
  }

  return (
    <div>
      <div id="googleSignInDiv"></div>
    </div>
  );
};

export default GoogleAuth;
