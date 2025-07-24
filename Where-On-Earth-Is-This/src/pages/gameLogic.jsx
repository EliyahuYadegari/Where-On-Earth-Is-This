// src/pages/gameLogic.jsx

import { useState, useEffect, useRef } from "react";
import { useTrie } from "../contexts/TrieProvider";
// ייבא את הפונקציות החדשות שנוספו ל-trie.js
import { getNodeForPrefix, getRandomWordFromNode } from "../game/trie";


function GameLogic() {
  const [guessedLetters, setGuessedLetters] = useState("");
  const [displayMessage, setDisplayMessage] = useState("...הזן אות ראשונה");
  const [displayAlertMessage, setDisplayAlertMessage] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");

  const [currentTrieNode, setCurrentTrieNode] = useState(null); 

  const trie = useTrie(); // זהו אובייקט ה-Trie שנוצר ע"י buildTrie
  const inputRef = useRef(null);

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isGameActive, setIsGameActive] = useState(false);

  // useEffect לטעינת Trie ולאתחול מצב התחלתי
  useEffect(() => {
    if (trie) {
      console.log("GameLogic.jsx: ה-Trie זמין ב-GameLogic דרך useTrie:", trie);
      // תיקון: trie עצמו הוא השורש במבנה שלך
      setCurrentTrieNode(trie); 
      setIsPlayerTurn(true);
      setIsGameActive(true);
      setDisplayMessage("המשחק מוכן! תורך. הזן אות ראשונה.");
    } else {
      console.log("GameLogic.jsx: ממתין ל-Trie דרך useTrie...");
      setDisplayMessage("...טוען נתוני משחק");
      setIsGameActive(false);
    }
  }, [trie]);

  // useEffect לטיפול בתור המחשב
  useEffect(() => {
    const handleComputerTurn = async () => {
      if (!isPlayerTurn && isGameActive && currentTrieNode && trie) {
        setDisplayMessage("...תור המחשב");
        setDisplayAlertMessage("");

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const computerMove = chooseComputerMove(currentTrieNode, trie);

        if (computerMove) {
          const { char, action } = computerMove;

          if (action === "continue") {
            const nextNode = currentTrieNode[char]; // תיקון: גישה ישירה לילד
            const newGuessedLetters = guessedLetters + char;
            setGuessedLetters(newGuessedLetters);
            setCurrentTrieNode(nextNode); 
            
            if (nextNode.isEndOfWord) {
                // שינוי: במקום להכריז על ניצחון המחשב, המשך לסבב הבא
                setDisplayAlertMessage(`המחשב השלים את המילה: "${newGuessedLetters}"! מתחילים מילה חדשה.`); //
                // setIsGameActive(false); // בוטל
                // setDisplayMessage("המחשב ניצח!"); // בוטל
                setGuessedLetters(""); // אפס את האותיות למילה הבאה
                setCurrentTrieNode(trie); // אפס לשורש ה-Trie כדי להתחיל מילה חדשה
                setIsPlayerTurn(true); // התור עובר בחזרה לשחקן
                setDisplayMessage("...הזן אות ראשונה למילה חדשה"); //

            } else {
                setDisplayMessage(`המחשב בחר: <span style="color: red;">${char}</span>. תורך.`); //
                setIsPlayerTurn(true); //
            }

          } else if (action === "new_word") {
            const nextNode = trie[char]; // תיקון: גישה ישירה לילד מהשורש (trie עצמו)
            const newGuessedLetters = char;
            setGuessedLetters(newGuessedLetters);
            setCurrentTrieNode(nextNode); 
            
            if (nextNode.isEndOfWord) {
                // שינוי: גם במקרה שהתחלת מילה חדשה הושלמה מיד
                setDisplayAlertMessage(`המחשב השלים את המילה: "${newGuessedLetters}"! מתחילים מילה חדשה.`); //
                // setIsGameActive(false); // בוטל
                // setDisplayMessage("המחשב ניצח!"); // בוטל
                setGuessedLetters(""); //
                setCurrentTrieNode(trie); //
                setIsPlayerTurn(true); //
                setDisplayMessage("...הזן אות ראשונה למילה חדשה"); //
            } else {
                setDisplayMessage(`המחשב התחיל מילה חדשה עם: <span style="color: red;">${char}</span>. תורך.`); //
                setIsPlayerTurn(true); //
            }
          }

          await new Promise((resolve) => setTimeout(resolve, 50));
          if (inputRef.current) {
            inputRef.current.focus();
          }
          setCurrentGuess("");
        } else {
          setDisplayAlertMessage(`המחשב נכנע! אין לו יותר מהלכים. ניצחת!`);
          setIsGameActive(false);
          setCurrentTrieNode(trie); // תיקון: איפוס לשורש ה-trie
          setGuessedLetters("");
          setIsPlayerTurn(true);
          setDisplayMessage("לחץ שלח כדי להתחיל משחק חדש!");
        }
      }
    };

    if (!isPlayerTurn && isGameActive) {
      handleComputerTurn();
    }
  }, [isPlayerTurn, isGameActive, currentTrieNode, guessedLetters, trie]);

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
      setDisplayAlertMessage("");
    } else if (!isHebrewLetter) {
      setDisplayAlertMessage("נא להזין אות בעברית");
      setCurrentGuess("");
    } else if (isFinalLetter) {
      setDisplayAlertMessage("נא להזין אות שאינה סופית");
      setCurrentGuess("");
    }
  };

  const handleSubmitLetter = () => {
    if (!isPlayerTurn || !isGameActive) {
      return;
    }

    if (currentGuess.length === 1 && trie && currentTrieNode) {
      const char = currentGuess;

      const isCurrentNodeEndOfWord = currentTrieNode.isEndOfWord;
      const nextNode = currentTrieNode[char]; // תיקון: גישה ישירה לילד
      const canContinuePath = !!nextNode;

      if (canContinuePath) {
        const newGuessedLetters = guessedLetters + char;
        setGuessedLetters(newGuessedLetters);
        setCurrentTrieNode(nextNode);
        setDisplayMessage("...הזן את האות הבאה");
        setDisplayAlertMessage("");

        if (nextNode.isEndOfWord) {
            setDisplayMessage(`המילה "${newGuessedLetters}" הושלמה! תור המחשב.`);
            setIsPlayerTurn(false);
        } else {
            setIsPlayerTurn(false);
        }

      } else {
        // האות שהוזנה לא ממשיכה את הקידומת הנוכחית.
        const charExistsAsRootChild = trie[char]; // תיקון: גישה ישירה לילד מהשורש (trie עצמו)

        if (isCurrentNodeEndOfWord && charExistsAsRootChild) {
          // השחקן סיים מילה קודמת והתחיל חדשה
          setCurrentTrieNode(trie[char]); // תיקון: גישה ישירה לילד מהשורש
          setGuessedLetters(char);
          setDisplayMessage(`מילה חדשה התחילה: '${char}'. תור המחשב...`);
          setDisplayAlertMessage("");
          setIsPlayerTurn(false);
        } else {
          // ננסה למצוא מילה אקראית מהקידומת שהייתה לפני שהשחקן טעה
          const suggestedWord = getRandomWordFromNode(currentTrieNode, guessedLetters); //

          let message = `יצאת בור!`;
          if (suggestedWord) {
              message += ` העיר שאני חשבתי עליה היא ${suggestedWord}`;
          } else {
              message += ` לא מצאתי מילה שהתחילה בקידומת "${guessedLetters}" במצב זה.`;
          }
          
          setDisplayAlertMessage(message); // הצג את ההודעה המותאמת אישית

          setCurrentTrieNode(trie); // איפוס לשורש ה-trie
          setGuessedLetters(""); // איפוס מילה
          setCurrentGuess("");
          setIsPlayerTurn(true); // התור נשאר אצל השחקן כדי להתחיל מחדש
          setDisplayMessage("...הזן אות ראשונה"); // הזמן את השחקן להתחיל מחדש
        }
      }
      setCurrentGuess("");
    } else if (currentGuess.length === 0) {
      setDisplayAlertMessage("נא להזין אות");
    } else {
      setDisplayAlertMessage("שגיאה: נתוני המשחק לא נטענו כראוי או קלט שגוי.");
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmitLetter();
      event.preventDefault();
    }
  };

  /**
   * בוחר תו אקראי למחשב, או בוחר להתחיל מילה חדשה אם הצומת הנוכחי הוא סוף מילה.
   *
   * @param {Object} node - הצומת הנוכחי בעץ ה-Trie.
   * @param {Object} trieInstance - מופע ה-Trie כולו (שהוא השורש במבנה שלך).
   * @returns {Object|null} - אובייקט המכיל { char: string, action: 'continue' | 'new_word' } או null אם אין אפשרויות.
   */
  const chooseComputerMove = (node, trieInstance) => {
    if (!node) {
      console.log("chooseComputerMove: node אינו קיים.");
      return null;
    }

    // קבל את המפתחות (האותיות) שהם ילדים חוקיים של הצומת הנוכחי.
    // נסנן את המאפיין 'isEndOfWord' אם הוא קיים ישירות על הצומת.
    const possibleContinuations = Object.keys(node).filter(key => key !== 'isEndOfWord');
    const isCurrentNodeEndOfWord = !!node.isEndOfWord; 

    const choices = [];

    // אפשרות 1: המחשב ממשיך את המילה הנוכחית
    possibleContinuations.forEach((char) => {
      if (node[char]) { // גישה ישירה לילד
        choices.push({ char, action: "continue" });
      }
    });

    // אפשרות 2: אם הצומת הנוכחי הוא סוף מילה, המחשב יכול לבחור להתחיל מילה חדשה
    // כאן trieInstance הוא בעצם השורש עצמו.
    if (isCurrentNodeEndOfWord && trieInstance) { 
      const possibleNewWordStarts = Object.keys(trieInstance).filter(key => key !== 'isEndOfWord');
      possibleNewWordStarts.forEach((char) => {
        if (trieInstance[char]) { // גישה ישירה לילד מהשורש
            choices.push({ char, action: "new_word" });
        }
      });
    }

    if (choices.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
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
      {guessedLetters.length > 0 && (
        <h2 style={{ color: "blue" }}>האותיות עד כה: {guessedLetters}</h2>
      )}

      <h3 dangerouslySetInnerHTML={{ __html: displayMessage }}></h3>
      <h3 style={{ color: "red" }}> {displayAlertMessage} </h3>

      <h5> נא להכניס אות לא סופית בעברית בלבד*</h5>
      <input
        type="text"
        value={currentGuess}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        maxLength="1"
        placeholder="הכנס אות אחת"
        ref={inputRef}
        disabled={!isPlayerTurn || !isGameActive}
        style={{
          fontSize: "34px",
          width: "240px",
          height: "80px",
          textAlign: "center",
          margin: "4px 0",
          backgroundColor: isPlayerTurn && isGameActive ? "#FFF" : "#EEE",
        }}
        dir="rtl"
      />
      

      <button
        onClick={handleSubmitLetter}
        disabled={!isPlayerTurn || !isGameActive}
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
          cursor: isPlayerTurn && isGameActive ? "pointer" : "not-allowed",
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