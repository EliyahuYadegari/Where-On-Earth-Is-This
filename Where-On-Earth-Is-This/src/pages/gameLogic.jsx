// src/pages/gamePage.jsx

import { useState, useEffect, useRef  } from "react";
import { useTrie } from "../contexts/TrieProvider";
import { isCorrectWord } from '../game/trie';

function GameLogic() {
  const [guessedLetters, setGuessedLetters] = useState("");
  const [displayMessage, setDisplayMessage] = useState("...הזן אות ראשונה");
  const [displayAlertMessage, setDisplayAlertMessage] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");   // כנראה זה יהיה מיותר

  const [currentTrieNode, setCurrentTrieNode] = useState(null); // נתחיל עם null ונאתחל ב-useEffect

  const trie = useTrie();
  const inputRef = useRef(null); // זהו ה-ref שיתייחס לתיבת הקלט

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
    if (trie) {
      console.log("GamePage.jsx: ה-Trie זמין ב-GamePage דרך useTrie:", trie);
      // setDisplayMessage("המשחק מוכן!"); // ניתן להפעיל כאן הודעה ראשונית אם תרצה
      setCurrentTrieNode(trie); // מאתחל את הצומת הנוכחי לשורש ה-Trie

    } else {
      console.log("GamePage.jsx: ממתין ל-Trie דרך useTrie...");
      setDisplayMessage("טוען נתוני משחק...");
    }
  }, [trie]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue.length === 0) {
      setCurrentGuess("");
      return;
    }

    const char = inputValue.charAt(0);

    const isHebrewLetter = char >= "\u05D0" && char <= "\u05EA";
    const finalLetters = ["\u05DD", "\u05E3", "\u05DA", "\u05DF", "\u05E5"];
    const isFinalLetter = finalLetters.includes(char);

    if (isHebrewLetter && !isFinalLetter) {
      setCurrentGuess(char);
      // אם האות תקינה, נקה הודעת שגיאה קודמת
      setDisplayAlertMessage("");
    } else if (!isHebrewLetter) {
      setDisplayAlertMessage("נא להזין אות בעברית");
    } else if (isFinalLetter) {
      setDisplayAlertMessage("נא להזין אות שאינה סופית");
    }
  };



  const handleSubmitLetter = () => {
    // ודא שיש תו בקלט הנוכחי וש-trie ו-currentTrieNode זמינים
    if (currentGuess.length === 1 && trie && currentTrieNode) {
      const char = currentGuess; // האות שהמשתמש שלח

      // ########################################################
      // לוגיקת בדיקת ה-Trie החדשה מתחילה כאן
      const isValidCharacterInTrie = isCorrectWord(trie, currentTrieNode, char);

      if (isValidCharacterInTrie) {
        // אם האות תקינה:
        const newGuessedLetters = guessedLetters + char; // הוסף אות לרשימת האותיות שניחשו
        setGuessedLetters(newGuessedLetters); // עדכן מצב
        console.log("האות שנשלחה:", char);

        // **עדכן את הצומת הנוכחי** ב-Trie
        // אם האות קיימת כבן של הצומת הנוכחי, עבור אליו.
        // (הפונקציה isCorrectWord כבר בדקה ש-charExistsInCurrentNode הוא true או isEndOfWord true)
        // אם הצומת הוא סוף מילה, עדיין נרצה להתקדם לילד שלו אם יש כזה.
        // לכן נבדוק רק אם יש בן כזה.
        if (currentTrieNode[char]) {
            setCurrentTrieNode(currentTrieNode[char]);
        } else {
            // אם isCorrectWord החזיר true בגלל isEndOfWord בלבד, ולא בגלל המשך
            // זה אומר שהמילה הושלמה.
            // במצב כזה, נרצה לאפס את currentTrieNode לשורש או לטפל בסיום מילה.
            // לטובת ההדגמה, נשאיר את זה כאיפוס לשורש עבור התחלה חדשה לאחר מילה שלמה.
            // לוגיקה זו תלויה במשחק שלך.
            setCurrentTrieNode(trie); // אפס לשורש להתחלה חדשה
        }

        setDisplayMessage("...הזן את האות הבאה"); // עדכן הודעת תצוגה
        setDisplayAlertMessage(""); // נקה התראות

      } else {
        // אם האות לא תקינה לפי ה-Trie:
        setDisplayAlertMessage("יא לוזרררר זה לא תקין. התחל מחדש");
        setCurrentTrieNode(trie); // אפס לשורש להתחלה חדשה
        setGuessedLetters(""); // עדכן מצב
        setCurrentGuess('')


        // אל תעדכן את guessedLetters
        // אל תעדכן את currentTrieNode
      }
      // ########################################################

      setCurrentGuess(""); // מאפסים את שדה הקלט בין אם תקין ובין אם לא
      console.log("currentGuess after reset:", currentGuess);
    
    } else {
        // מצב שבו currentGuess.length > 1 (לא אמור לקרות בגלל maxLength)
        // או ש-trie/currentTrieNode אינם זמינים
        setDisplayAlertMessage("שגיאה: נתוני המשחק אינם מוכנים או קלט שגוי");
        setCurrentGuess(""); // נקה למקרה כזה
    }
    if (inputRef.current) { // ודא שה-ref קיים ומצביע לרכיב DOM
        inputRef.current.focus(); // החזר את הפוקוס לתיבת הקלט
      }
  };

  
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmitLetter();
      event.preventDefault();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "5px",
        borderRadius: "10px",
        border: "3px solid black",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
        margin: "10px auto",
      }}
    >
      {guessedLetters.length > 0 && <h2 style={{ color: "blue", }}>האותיות עד כה: {guessedLetters}</h2>}

      <h2>{displayMessage}</h2>

      <h4> נא להכניס אות לא סופית בעברית בלבד*</h4>
      <input
        type="text"
        value={currentGuess}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        maxLength="1"
        placeholder="הכנס אות אחת"
        ref={inputRef}
        style={{
          fontSize: "34px",
          width: "240px",
          height: "80px",
          textAlign: "center",
          margin: "10px 0",
        }}
        dir="rtl"
      />
      <h3 style={{ color: "red", }} > {displayAlertMessage} </h3>

      <button
        onClick={handleSubmitLetter}
        style={{
          backgroundColor: "rgba(46, 165, 112, 0.5)",
          padding: "25px",
          borderRadius: "10px",
          border: "3px solid green",
          textAlign: "center",
          maxWidth: "140px",
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


    </div>
  );
}

export default GameLogic;
