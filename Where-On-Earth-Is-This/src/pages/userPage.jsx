// src/pages/UserPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebase";
import GameLogic from "./gameLogic";

function UserPage() {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
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

  // פונקציה להתחלת עריכת השם
  const handleStartEditName = () => {
    const displayName = currentUserData?.customDisplayName || currentUserData?.displayName || 'אורח';
    setNewName(displayName);
    setIsEditingName(true);
    setNameError('');
  };

  // פונקציה לביטול עריכת השם
  const handleCancelEditName = () => {
    setIsEditingName(false);
    setNewName('');
    setNameError('');
  };

  // פונקציה לשמירת השם החדש
  const handleSaveName = async () => {
    if (!newName.trim()) {
      setNameError('שם המשתמש לא יכול להיות ריק');
      return;
    }

    if (newName.trim().length < 2) {
      setNameError('שם המשתמש חייב להכיל לפחות 2 תווים');
      return;
    }

    if (newName.trim().length > 30) {
      setNameError('שם המשתמש לא יכול להכיל יותר מ-30 תווים');
      return;
    }

    setIsUpdatingName(true);
    setNameError('');

    try {
      // לעכשיו נשמור רק ב-sessionStorage - ללא Firestore
      const updatedUserData = {
        ...currentUserData,
        customDisplayName: newName.trim()
      };

      // עדכון sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUserData));

      // עדכון ה-state
      setCurrentUserData(updatedUserData);
      setIsEditingName(false);
      setNewName('');

      console.log("User name updated successfully!");
    } catch (error) {
      console.error('Error updating user name:', error);
      setNameError('שגיאה בעדכון השם. נסה שוב.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  // פונקציה לאיפוס השם למקורי
  const handleResetToOriginalName = async () => {
    setIsUpdatingName(true);
    setNameError('');

    try {
      // עדכון הנתונים המקומיים - מחיקת השם המותאם אישית
      const updatedUserData = { ...currentUserData };
      delete updatedUserData.customDisplayName;

      // עדכון sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUserData));

      // עדכון ה-state
      setCurrentUserData(updatedUserData);
      setIsEditingName(false);
      setNewName('');

      console.log("User name reset to original successfully!");
    } catch (error) {
      console.error('Error resetting user name:', error);
      setNameError('שגיאה באיפוס השם. נסה שוב.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  // פונקציה לטיפול ב-Enter ו-Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEditName();
    }
  };

  // השם המוצג
  const displayName = currentUserData?.customDisplayName || currentUserData?.displayName || 'אורח';
  const originalName = currentUserData?.displayName || 'אורח';
  const hasCustomName = !!currentUserData?.customDisplayName;

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
      {/* אזור השם והעריכה */}
      <div style={{ marginBottom: "10px", padding: "10px" }}>
        {!isEditingName ? (
          <div>
            <h2>
              ברוך הבא{" "}
              <strong style={{ color: "blue" }}>
                {displayName}
              </strong>
            </h2>

            {hasCustomName && (
              <div style={{ fontSize: "0.8em", color: "gray", marginBottom: "5px" }}>
                שם מקורי: {originalName}
              </div>
            )}

            <button
              onClick={handleStartEditName}
              style={{
                backgroundColor: "#2196F3",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9em",
                marginTop: "5px"
              }}
            >
              ✏️ שנה שם משתמש
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px",
            border: "2px solid #2196F3",
            maxWidth: "400px",
            margin: "0 auto"
          }}>
            <h3 style={{ color: "#2196F3", marginBottom: "10px" }}>
              עריכת שם משתמש
            </h3>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="הזן שם חדש..."
              maxLength="30"
              disabled={isUpdatingName}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1em",
                textAlign: "center",
                marginBottom: "10px",
                boxSizing: "border-box"
              }}
              dir="rtl"
            />

            {nameError && (
              <div style={{
                color: "red",
                fontSize: "0.8em",
                marginBottom: "10px"
              }}>
                {nameError}
              </div>
            )}

            <div style={{
              display: "flex",
              gap: "5px",
              justifyContent: "center",
              marginBottom: "10px"
            }}>
              <button
                onClick={handleSaveName}
                disabled={isUpdatingName}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: isUpdatingName ? "not-allowed" : "pointer",
                  fontSize: "0.9em",
                  opacity: isUpdatingName ? 0.6 : 1
                }}
              >
                ✓ שמור
              </button>

              <button
                onClick={handleCancelEditName}
                disabled={isUpdatingName}
                style={{
                  backgroundColor: "#757575",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: isUpdatingName ? "not-allowed" : "pointer",
                  fontSize: "0.9em",
                  opacity: isUpdatingName ? 0.6 : 1
                }}
              >
                ✕ ביטול
              </button>
            </div>

            {hasCustomName && (
              <button
                onClick={handleResetToOriginalName}
                disabled={isUpdatingName}
                style={{
                  backgroundColor: "#FF9800",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: isUpdatingName ? "not-allowed" : "pointer",
                  fontSize: "0.8em",
                  opacity: isUpdatingName ? 0.6 : 1
                }}
              >
                🔄 חזור לשם המקורי
              </button>
            )}

            {isUpdatingName && (
              <div style={{
                color: "#666",
                fontSize: "0.8em",
                marginTop: "10px"
              }}>
                שומר...
              </div>
            )}
          </div>
        )}
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