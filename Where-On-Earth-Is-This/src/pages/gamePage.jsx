// src/pages/gamePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import allSettlementsData from '../../data/settlements.json'; // לא נשתמש בזה ישירות אם משתמשים ב-Trie לגישה ליישובים
import { useTrie } from '../contexts/TrieProvider'; // ודא נתיב נכון ל-contexts/TrieProvider.jsx
import { auth, signOut } from '../firebase'; // ודא נתיב נכון ל-firebase

function GamePage() {
    // מצבים שקשורים ללוגיקת המשחק והקלט
    const [currentGuess, setCurrentGuess] = useState(''); // האות הנוכחית שהוקלדה
    const [guessedLetters, setGuessedLetters] = useState(""); // רצף האותיות שנוחשו עד עכשיו
    const [displayMessage, setDisplayMessage] = useState("הזן אות ראשונה...");

    // מצבים שקשורים לניהול משתמש
    const [currentUserData, setCurrentUserData] = useState(null);
    const navigate = useNavigate();

    // קבלת ה-Trie מהקונטקסט
    const trie = useTrie();

    // --- useEffect לטעינת נתוני משתמש מ-sessionStorage ---
    useEffect(() => {
        const loadUserData = () => {
            const storedUser = sessionStorage.getItem("currentUser");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setCurrentUserData(parsedUser);
            } else {
                console.log("No user data in session storage, navigating to login.");
                navigate("/"); // נווט חזרה לדף ההתחברות
            }
        };
        loadUserData();
    }, [navigate]);

    // --- useEffect לבדיקה שה-Trie אכן זמין דרך ה-Hook ---
    useEffect(() => {
        if (trie) {
            console.log("GamePage.jsx: ה-Trie זמין ב-GamePage דרך useTrie:", trie);
            // כאן תוכל להוסיף לוגיקה שתלויה ב-Trie, לדוגמה:
            // setDisplayMessage("המשחק מוכן!");
        } else {
            console.log("GamePage.jsx: ממתין ל-Trie דרך useTrie...");
            setDisplayMessage("טוען נתוני משחק...");
        }
    }, [trie]); // יופעל כשה-trie משתנה (כלומר, כשהוא מוכן)

    // --- פונקציית התנתקות ---
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

    const handleInputChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue.length === 0) {
            setCurrentGuess("");
            return;
        }

        const char = inputValue.charAt(0);

        const isHebrewLetter = (char >= '\u05D0' && char <= '\u05EA');
        const finalLetters = ['\u05DD', '\u05E3', '\u05DA', '\u05DF', '\u05E5']; // ם, ף, ך, ן, ץ
        const isFinalLetter = finalLetters.includes(char);

        if (isHebrewLetter && !isFinalLetter) {
            setCurrentGuess(char);
        } else if (!isHebrewLetter) {
            // הוספת הודעה למשתמש אם הקלט אינו אות עברית
            setDisplayMessage('נא להזין אות בעברית');
        } else if (isFinalLetter) {
            // הוספת הודעה למשתמש אם הקלט הוא אות סופית
            setDisplayMessage('נא להזין אות שאינה סופית');
        }
    };

    const handleSubmitLetter = () => {
        if (currentGuess.length === 1) {
            const newGuessedLetters = guessedLetters + currentGuess;
            setGuessedLetters(newGuessedLetters);
            console.log('האות שנשלחה:', currentGuess);

            // כאן תוכל להוסיף לוגיקת משחק עם ה-Trie:
            // לדוגמה, לבדוק אם יש יישובים שמתחילים ב-newGuessedLetters
            if (trie) {
                const completions = trie.autocomplete(newGuessedLetters);
                if (completions.length > 0) {
                    setDisplayMessage(`יש ${completions.length} יישובים שמתחילים ב-${newGuessedLetters}!`);
                    // אתה יכול גם להציג רמזים מתוך completions
                } else {
                    setDisplayMessage(`אין יישובים שמתחילים ב-${newGuessedLetters}. נסה אות אחרת.`);
                }
            } else {
                setDisplayMessage("ה-Trie אינו זמין עדיין.");
            }

            setCurrentGuess(''); // מאפסים את שדה הקלט
        } else {
            setDisplayMessage('נא להכניס אות אחת בלבד');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmitLetter();
            event.preventDefault();
        }
    };

    return (
        <div style={{
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "10px",
            border: "3px solid red",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
            margin: "20px auto" // כדי למרכז את הדיב בדף
        }}>
            {/* הצגת שם משתמש */}
            <div style={{ marginBottom: "20px" }}>
                <h2>
                    ברוך הבא{" "}
                    <strong style={{ color: "blue" }}>
                        {currentUserData?.displayName || "אורח"}{" "}
                    </strong>
                </h2>
            </div>

            {guessedLetters.length > 0 && (
                <h2>האותיות עד כה: {guessedLetters}</h2>
            )}

            <h1>{displayMessage}</h1>
            <h3> נא להכניס אות לא סופית בעברית בלבד*</h3>
            <input
                type='text'
                value={currentGuess}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                maxLength="1"
                placeholder='הכנס אות אחת'
                style={{ fontSize: '34px', width: '240px', height: '80px', textAlign: 'center', margin: '10px 0' }}
                dir="rtl" // כיוון כתיבה מימין לשמאל
            />

            <br /><br />
            <button
                onClick={handleSubmitLetter}
                style={{
                    backgroundColor: "rgba(46, 165, 112, 0.5)",
                    padding: "25px",
                    borderRadius: "10px",
                    border: "3px solid green",
                    textAlign: "center",
                    maxWidth: "260px",
                    width: "100%",
                    fontSize: "1.2em",
                    fontWeight: "800",
                    color: "#007bff",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "background-color 0.3s ease",
                }}
            >
                שלח
            </button>

            <br /><br />
            <button
                onClick={handleSignOut}
                style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "20px",
                    fontSize: "1em",
                    fontWeight: "bold",
                }}
            >
                התנתק
            </button>
        </div>
    );
}

export default GamePage;