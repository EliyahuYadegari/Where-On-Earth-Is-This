// src/pages/gamePage.jsx

import React, { useState, useEffect } from 'react';
// import allSettlementsData from '../../data/settlements.json';
// ***** הוספה: ייבוא ה-Hook החדש לגישה ל-Trie *****
import { useTrie } from '../contexts/TrieProvider'; // ודא נתיב נכון ל-contexts/TrieProvider.jsx

function GamePage() {
    // const [settlements, setSettlements] = useState(allSettlementsData);

    const trie = useTrie(); // אין צורך לקבל כ-prop

    // ***** הוספה: useEffect לבדיקה שה-Trie אכן זמין דרך ה-Hook *****
    useEffect(() => {
        if (trie) {
            console.log("GamePage.jsx: ה-Trie זמין ב-GamePage דרך useTrie:", trie);
        } else {
            console.log("GamePage.jsx: ממתין ל-Trie דרך useTrie...");
            setDisplayMessage("טוען נתוני משחק...");
        }
    }, [trie]); // יופעל כשה-trie משתנה (כלומר, כשהוא מוכן)


    const [currentGuess, setCurrentGuess] = useState(''); // האות הנוכחית שהוקלדה
    const [guessedLetters, setGuessedLetters] = useState(""); // רצף האותיות שנוחשו עד עכשיו

    const [displayMessage, setDisplayMessage] = useState("הזן אות ראשונה...");


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
            const newGuessedLetters = guessedLetters + currentGuess; // יצרתי משתנה מקומי
            setGuessedLetters(newGuessedLetters); // מוסיפים את האות לרצף
            console.log('האות שנשלחה:', currentGuess); // להדפסה בקונסול
            setDisplayMessage(`אפשר להמשיך!`);
            setCurrentGuess(''); // מאפסים את שדה הקלט לאחר השליחה

            // כאן תוכל להוסיף לוגיקת משחק:
            // - בדיקה אם האות נכונה
            // - עדכון מצב המשחק בהתאם לאות (למשל, סינון רשימת הערים)
            // - הצגת רמזים או התקדמות
        } else {
            setDisplayMessage('נא להכניס אות אחת בלבד'); // שינוי הודעה
            // alert('נא להכניס אות לא סופית בעברית בלבד');
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
            {guessedLetters.length > 0 && (
                <h2>האותיות עד כה: {guessedLetters}. </h2>
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
                style={{ fontSize: '34px', width: '240px', hight: '80px', textAlign: 'center', margin: '10px 0' }}
                dir="rtl" // <--- הוספה: כיוון כתיבה מימין לשמאל
            />

            <button onClick={handleSubmitLetter} style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '18px' }}>
                שלח
            </button>


        </div>
    );
}

export default GamePage;