import React, { useState, useEffect } from 'react';
import allSettlementsData from '../../data/settlements.json';

function GamePage() {
    const [settlements, setSettlements] = useState(allSettlementsData);
    const [currentGuess, setCurrentGuess] = useState(''); // האות הנוכחית שהוקלדה
    const [guessedLetters, setGuessedLetters] = useState(""); // רצף האותיות שנוחשו עד עכשיו

    const handleInputChange = (event) => {
        const inputValue = event.target.value;

        // אם אין קלט, נאפס את הניחוש הנוכחי ונצא.
        if (inputValue.length === 0) {
            setCurrentGuess("");
            return;
        }

        const char = inputValue.charAt(0);

        // טווח ה-Unicode של אותיות עבריות הוא בין '\u05D0' ל-'\u05EA'.
        const isHebrewLetter = (char >= '\u05D0' && char <= '\u05EA');

        // שומר רשימה של האותיות הסופיות כי הן חלק מהאותיות ואז בודק אם הקלט הוא חלק מהאותיות האלה
        const finalLetters = ['\u05DD', '\u05E3', '\u05DA', '\u05DF', '\u05E5']; // ם, ף, ך, ן, ץ
        const isFinalLetter = finalLetters.includes(char);

        // בודק אם התו הוא אות בעברית ולא אות סופית
        if (isHebrewLetter && !isFinalLetter) {
            setCurrentGuess(char);
        }
    };

    const handleSubmitLetter = () => {
        if (currentGuess.length === 1) { // ודא שאכן יש אות אחת לשלוח
            setGuessedLetters(prevGuessedLetters => prevGuessedLetters + currentGuess); // מוסיפים את האות לרצף
            console.log('האות שנשלחה:', currentGuess); // להדפסה בקונסול
            setCurrentGuess(''); // מאפסים את שדה הקלט לאחר השליחה

            // כאן תוכל להוסיף לוגיקת משחק:
            // - בדיקה אם האות נכונה
            // - עדכון מצב המשחק בהתאם לאות (למשל, סינון רשימת הערים)
            // - הצגת רמזים או התקדמות
        } else {
            alert('נא להכניס אות לא סופית בעברית בלבד'); // התראה למשתמש
        }
    };

    // פונקציה לטיפול בלחיצות מקשים בשדה הקלט (לאנטר)
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmitLetter(); // אם נלחץ אנטר, בצע שליחה
            event.preventDefault(); // מונע התנהגות ברירת מחדל של אנטר
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1> :עד עכשיו</h1>
            <h2>{guessedLetters}</h2>

            <h1>?מה האות הבאה</h1>
            <h3> נא להכניס אות לא סופית בעברית בלבד*</h3>

            <input
                type='text'
                value={currentGuess} // הקלט כעת נשלט ע"י המצב currentGuess
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                maxLength="1" // הגבלה פיזית של תווים ב-HTML
                placeholder='הכנס אות אחת'
                style={{ fontSize: '34px', width: '240px', hight: '80px', textAlign: 'center', margin: '10px 0' }}
            />

            <button onClick={handleSubmitLetter} style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '18px' }}>
                שלח
            </button>


        </div>
    );
}

export default GamePage;