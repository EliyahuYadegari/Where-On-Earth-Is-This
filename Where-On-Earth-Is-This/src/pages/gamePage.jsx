import React, { useState, useEffect } from 'react';
import allSettlementsData from '../../data/settlements.json';

function GamePage() {
    const [settlements, setSettlements] = useState(allSettlementsData);
    const [currentGuess, setCurrentGuess] = useState(''); // האות הנוכחית שהוקלדה
    const [guessedLetters, setGuessedLetters] = useState(""); // רצף האותיות שנוחשו עד עכשיו

    const handleInputChange = (event) => {
        // רק אותיות בעברית ובלי מספרים
        // בלי אותיות סופיות- םףךןץ
        const inputValue = event.target.value;
        if (inputValue.length <= 1) {
            setCurrentGuess(inputValue); 
        } else {
            setCurrentGuess(inputValue.charAt(0));
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
            alert('אנא הכנס אות אחת בלבד.'); // התראה למשתמש
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