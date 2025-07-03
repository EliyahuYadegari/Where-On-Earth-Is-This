// src/pages/gamePage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrie } from '../contexts/TrieProvider';
import { auth, signOut } from '../firebase';

function GamePage() {
    const [currentGuess, setCurrentGuess] = useState('');
    const [guessedLetters, setGuessedLetters] = useState("");
    const [displayMessage, setDisplayMessage] = useState("הזן אות ראשונה...");

    const [currentUserData, setCurrentUserData] = useState(null);
    const navigate = useNavigate();

    const trie = useTrie();


    // פעולות שאפשר לעשות עם הtrie

    // המצביע לשורש של העץ
    // let currentNode = trie.root;
    // console.log(currentNode);
    // const char = 'ב'; // נניח שאנחנו מחפשים את האות ב'
    // // מעבר לבן
    // if (currentNode.children[char]) { // ודא שהבן קיים
    //     currentNode = currentNode.children[char]; // עברנו לצומת של 'ב'
    // } else {
    //     // האות 'ב' אינה המשך חוקי מהצומת הנוכחי
    //     // לדוגמה, אין מילים שמתחילות בקידומת הנוכחית עם האות 'ב' אחריה
    //     console.log(`אין ילד לאות '${char}'`);
    //     // כאן תוכל לטפל במצב שבו אין המשך חוקי
    // }
    // // זיהוי של עלה
    // if (Object.keys(currentNode.children).length === 0) {
    //     console.log("הצומת הנוכחי הוא עלה (אין לו ילדים).");
    //     // זה אומר שהקידומת שהגענו אליה היא מקסימלית מבחינת המשך ב-Trie.
    //     // אם גם isEndOfWord הוא true, אז זו מילה סופית בלקסיקון.
    // }
    // //  לזהות שצומת מסוים הוא סוף מילה
    // if (currentNode.isEndOfWord) {
    //     console.log("הקידומת שמסתיימת בצומת זה היא מילה חוקית בפני עצמה.");
    // }



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

    useEffect(() => {
        if (trie) {
            console.log("GamePage.jsx: ה-Trie זמין ב-GamePage דרך useTrie:", trie);
            // setDisplayMessage("המשחק מוכן!"); // ניתן להפעיל כאן הודעה ראשונית אם תרצה
        } else {
            console.log("GamePage.jsx: ממתין ל-Trie דרך useTrie...");
            setDisplayMessage("טוען נתוני משחק...");
        }
    }, [trie]);

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
        const finalLetters = ['\u05DD', '\u05E3', '\u05DA', '\u05DF', '\u05E5'];
        const isFinalLetter = finalLetters.includes(char);

        if (isHebrewLetter && !isFinalLetter) {
            setCurrentGuess(char);
            // אם האות תקינה, נקה הודעת שגיאה קודמת
            setDisplayMessage("הזן אות ראשונה...");
        } else if (!isHebrewLetter) {
            setDisplayMessage('נא להזין אות בעברית');
        } else if (isFinalLetter) {
            setDisplayMessage('נא להזין אות שאינה סופית');
        }
    };

    const handleSubmitLetter = () => {
        if (currentGuess.length === 1) {
            const newGuessedLetters = guessedLetters + currentGuess;
            setGuessedLetters(newGuessedLetters);
            console.log('האות שנשלחה:', currentGuess);

            // ודק אם ה-trie קיים ומעדכן את הודעת התצוגה עם האותיות שניחשו עד כה, או מציג הודעה שה-Trie אינו זמין
            if (trie) {
                setDisplayMessage(`האותיות עד כה: ${newGuessedLetters}`);
            } else {
                setDisplayMessage("ה-Trie אינו זמין עדיין.");
            }

            setCurrentGuess(''); // מאפסים את שדה הקלט
            console.log('currentGuess after reset:', currentGuess);
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
            margin: "20px auto"
        }}>
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
                dir="rtl"
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