import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import allSettlementsData from "../../data/settlements.json";
import {  auth, signOut, } from "../firebase"; 

function GamePage() {
  const [settlements, setSettlements] = useState(allSettlementsData);
  const [currentGuess, setCurrentGuess] = useState(""); // האות הנוכחית שהוקלדה
  const [guessedLetters, setGuessedLetters] = useState(""); // רצף האותיות שנוחשו עד עכשיו

  const [currentUserData, setCurrentUserData] = useState(null); // ישמור את האובייקט מה-sessionStorage

  const navigate = useNavigate();

  // --- useEffect לטעינת נתוני משתמש מ-sessionStorage בלבד ---
  useEffect(() => {
    const loadUserData = () => {
      // פונקציה זו כבר לא צריכה להיות async
      const storedUser = sessionStorage.getItem("currentUser"); // קוראים את הנתונים מ-sessionStorage

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser); // מנתחים את המחרוזת בחזרה לאובייקט JavaScript
        setCurrentUserData(parsedUser); // שומרים את הנתונים הכלליים
      } else {
        // אם אין מידע ב-sessionStorage, המשתמש לא מחובר או שה-session פג
        console.log("No user data in session storage, navigating to login.");
        navigate("/"); // נווט חזרה לדף ההתחברות
      }
    };

    loadUserData(); // קוראים לפונקציה ברגע שהקומפוננטה נטענת
  }, [navigate]); // navigate כתלות, כדי למנוע אזהרה ולפעול נכון


  // --- פונקציית התנתקות  ---
const handleSignOut = async () => {
  try {
    await signOut(auth); // מבצע התנתקות מ-Firebase באמצעות האובייקט 'auth'
    sessionStorage.removeItem("currentUser"); // מנקה את הנתונים מ-sessionStorage
    console.log("User signed out and session storage cleared.");
    navigate("/"); // מנווט את המשתמש בחזרה לדף ההתחברות (הדף הראשי)
  } catch (error) {
    console.error("Error signing out:", error.message);
    alert(`שגיאת התנתקות: ${error.message}`); // הצג הודעת שגיאה למשתמש במקרה של כשל
  }
};


  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    // אם אין קלט, נאפס את הניחוש הנוכחי ונצא.
    if (inputValue.length === 0) {
      setCurrentGuess("");
      return;
    }

    const char = inputValue.charAt(0);

    // טווח ה-Unicode של אותיות עבריות הוא בין '\u05D0' ל-'\u05EA'.
    const isHebrewLetter = char >= "\u05D0" && char <= "\u05EA";

    // שומר רשימה של האותיות הסופיות כי הן חלק מהאותיות ואז בודק אם הקלט הוא חלק מהאותיות האלה
    const finalLetters = ["\u05DD", "\u05E3", "\u05DA", "\u05DF", "\u05E5"]; // ם, ף, ך, ן, ץ
    const isFinalLetter = finalLetters.includes(char);

    // בודק אם התו הוא אות בעברית ולא אות סופית
    if (isHebrewLetter && !isFinalLetter) {
      setCurrentGuess(char);
    }
  };

  const handleSubmitLetter = () => {
    if (currentGuess.length === 1) {
      // ודא שאכן יש אות אחת לשלוח
      setGuessedLetters(
        (prevGuessedLetters) => prevGuessedLetters + currentGuess
      ); // מוסיפים את האות לרצף
      console.log("האות שנשלחה:", currentGuess); // להדפסה בקונסול
      setCurrentGuess(""); // מאפסים את שדה הקלט לאחר השליחה

      // כאן תוכל להוסיף לוגיקת משחק:
      // - בדיקה אם האות נכונה
      // - עדכון מצב המשחק בהתאם לאות (למשל, סינון רשימת הערים)
      // - הצגת רמזים או התקדמות
    } else {
      alert("נא להכניס אות לא סופית בעברית בלבד"); // התראה למשתמש
    }
  };

  // פונקציה לטיפול בלחיצות מקשים בשדה הקלט (לאנטר)
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmitLetter(); // אם נלחץ אנטר, בצע שליחה
      event.preventDefault(); // מונע התנהגות ברירת מחדל של אנטר
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff", // רקע לבן בתוך המסגרת
        padding: "40px", // ריפוד פנימי
        borderRadius: "10px", // פינות מעוגלות
        border: "3px solid red", // גבול כחול
        textAlign: "center", // מרכז את הטקסט בתוך המסגרת
        maxWidth: "400px", // רוחב מקסימלי למסגרת
        width: "100%", // רוחב מלא בתוך ה-maxWidth
      }}
    >
      {/* --- הצגת שם משתמש בלבד --- */}
      <div style={{ marginBottom: "20px" }}>
        <h2>
          ברוך הבא{" "}
          <strong style={{ color: "blue" }}>
            {currentUserData?.displayName || "אורח"}{" "}
          </strong>
          
        </h2>
      </div>
      <h2> :עד עכשיו</h2>
      <h1>{guessedLetters}</h1>
      <h2>?מה האות הבאה</h2>
      <h5> נא להכניס אות לא סופית בעברית בלבד*</h5>
      <input
        type="text"
        value={currentGuess} // הקלט כעת נשלט ע"י המצב currentGuess
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        maxLength="1" // הגבלה פיזית של תווים ב-HTML
        placeholder="הכנס אות אחת"
        style={{
          fontSize: "34px",
          width: "240px",
          hight: "80px",
          textAlign: "center",
          margin: "10px 0",
        }}
      />
      <br /> <br />
      <button
        style={{
          backgroundColor: "rgba(46, 165, 112, 0.5)", // רקע לבן בתוך המסגרת
          padding: "25px", // ריפוד פנימי
          borderRadius: "10px", // פינות מעוגלות
          border: "3px solid green", // גבול כחול
          textAlign: "center", // מרכז את הטקסט בתוך המסגרת
          maxWidth: "260px", // רוחב מקסימלי למסגרת
          width: "100%", // רוחב מלא בתוך ה-maxWidth
          // הוספתי סגנונות נוספים כדי שהכפתור ייראה טוב יותר ויפעל כצפוי
          fontSize: "1.2em",
          fontWeight: "800",
          color: "#007bff", // שינוי צבע טקסט הכפתור לכחול כדי שיתאים לרקע לבן
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          transition: "background-color 0.3s ease",
        }}
        onClick={handleSubmitLetter}
      >
        שלח
      </button>


      <br /><br />
         <button
        onClick={handleSignOut} // זה מה שיפעיל את פונקציית ההתנתקות
        style={{
          backgroundColor: "#f44336", // צבע אדום לכפתור התנתקות
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          marginTop: "20px", // מרווח מהאלמנטים שמעליו
          fontSize: "1em",
          fontWeight: "bold", // קצת יותר בולט
        }}
      >
        התנתק
      </button>

    </div>
  );
}

export default GamePage;
