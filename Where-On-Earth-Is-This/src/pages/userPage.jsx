// src/pages/UserPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebase";
import GameLogic from "./gameLogic";

function UserPage() {
  const [currentUserData, setCurrentUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      const storedUser = sessionStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUserData(parsedUser);
      } else {
        console.log("No user data in session storage, navigating to login.");
        navigate("/");
      }
    };
    loadUserData();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("currentUser");
      console.log("User signed out and session storage cleared.");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert(`שגיאת התנתקות: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "5px",
        borderRadius: "10px",
        border: "3px solid green",
        textAlign: "center",
        maxWidth: "700px",
        maxHeight: "650px",
        width: "100%",
        margin: "20px auto",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <h2>
          ברוך הבא{" "}
          <strong style={{ color: "blue" }}>
            {currentUserData?.displayName || "אורח"}{" "}
          </strong>
        </h2>
      </div>

      <GameLogic />

    
      <button
        onClick={handleSignOut}
        style={{
          backgroundColor: "#f44336",
          color: "white",
          padding: "10px 10px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          fontSize: "1em",
          fontWeight: "bold",
        }}
      >
        התנתק
      </button>
    </div>
  );
}

export default UserPage;
