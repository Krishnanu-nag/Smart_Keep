import React, { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const GoogleAuth = () => {
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

  function handleCredentialResponse(response) {
    // console.log("JWT ID Token:", response.credential);
    const decoded = jwtDecode(response.credential);
    console.log(decoded)
    console.log("Name",decoded.name);
    console.log("Email",decoded.email);
    // You can decode it with jwt-decode to get user details
  }

  return (
    <div>
      <div id="googleSignInDiv"></div>
    </div>
  );
};

export default GoogleAuth;



