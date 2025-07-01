import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/game");
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff", // רקע לבן בתוך המסגרת
        padding: "40px", // ריפוד פנימי
        borderRadius: "10px", // פינות מעוגלות
        border: "3px solid blue", // גבול כחול
        textAlign: "center", // מרכז את הטקסט בתוך המסגרת
        maxWidth: "400px", // רוחב מקסימלי למסגרת
        width: "100%", // רוחב מלא בתוך ה-maxWidth
      }}
    >
      <h1>Where On Earth Is This?!</h1>

     <button
          onClick={handleStartGame}
          style={{
            backgroundColor: "rgba(46, 165, 112, 0.5)", // רקע לבן בתוך המסגרת
            padding: "25px", // ריפוד פנימי
            borderRadius: "10px", // פינות מעוגלות
            border: "3px solid green", // גבול כחול
            textAlign: "center", // מרכז את הטקסט בתוך המסגרת
            maxWidth: "260px", // רוחב מקסימלי למסגרת
            width: "100%", // רוחב מלא בתוך ה-maxWidth
            // הוספתי סגנונות נוספים כדי שהכפתור ייראה טוב יותר ויפעל כצפוי
            fontSize: '1.2em',
            fontWeight: '800',
            color: '#007bff', // שינוי צבע טקסט הכפתור לכחול כדי שיתאים לרקע לבן
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s ease'
          }}
        >
          Start Game!
        </button>
    </div>
  );
}
export default LoginPage;
