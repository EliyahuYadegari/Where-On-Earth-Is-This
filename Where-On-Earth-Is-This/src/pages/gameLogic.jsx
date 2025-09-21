// src/pages/gameLogic.jsx

import { useState, useEffect, useRef } from "react";
import { useTrie } from "../contexts/TrieProvider";
import { getNodeForPrefix, getRandomWordFromNode, findNextNode, getActualChar } from "../game/trie";


function GameLogic() {
  const [guessedLetters, setGuessedLetters] = useState("");
  const [displayMessage, setDisplayMessage] = useState("...הזן אות ראשונה");
  const [displayAlertMessage, setDisplayAlertMessage] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");

  const [currentTrieNode, setCurrentTrieNode] = useState(null); 
  const [currentScore, setCurrentScore] = useState(0); // מצב חדש לניקוד הנוכחי

  // שינוי: שימוש ב-Hook כדי לקבל גם את ה-Trie וגם את נתוני היישובים
  const { trie, settlements } = useTrie(); 
  const inputRef = useRef(null);

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isGameActive, setIsGameActive] = useState(false);

  // useEffect לטעינת Trie ולאתחול מצב התחלתי
  useEffect(() => {
    if (trie && settlements) { // ודא שגם ה-trie וגם ה-settlements זמינים
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
  }, [trie, settlements]); // הוספת settlements כתלות

  // useEffect לטיפול בתור המחשב
  useEffect(() => {
    const handleComputerTurn = async () => {
      if (!isPlayerTurn && isGameActive && currentTrieNode && trie && settlements) {
        setDisplayMessage("...תור המחשב");
        setDisplayAlertMessage("");

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const computerMove = chooseComputerMove(currentTrieNode, trie);

        if (computerMove) {
          const { char, action } = computerMove;

          if (action === "continue") {
            const nextNode = currentTrieNode[char]; 
            const newGuessedLetters = guessedLetters + char;
            setGuessedLetters(newGuessedLetters);
            setCurrentTrieNode(nextNode); 
            
            if (nextNode.isEndOfWord) {
                // מציאת הניקוד של היישוב והוספתו
                const settlement = settlements.find(s => s.name.replace(/\s+/g, '') === newGuessedLetters);
                if (settlement) {
                  setCurrentScore(prevScore => prevScore + settlement.score);
                }

                setDisplayAlertMessage(`המחשב השלים את המילה: "${newGuessedLetters}"! מתחילים מילה חדשה.`); 
                setGuessedLetters(""); 
                setCurrentTrieNode(trie); 
                setIsPlayerTurn(true); 
                setDisplayMessage("...הזן אות ראשונה למילה חדשה"); 

            } else {
                setDisplayMessage(`המחשב בחר: <span style="color: red;">${char}</span>. תורך.`); 
                setIsPlayerTurn(true); 
            }

          } else if (action === "new_word") {
            const nextNode = trie[char]; 
            const newGuessedLetters = char;
            setGuessedLetters(newGuessedLetters);
            setCurrentTrieNode(nextNode); 
            
            if (nextNode.isEndOfWord) {
                // מציאת הניקוד של היישוב והוספתו
                const settlement = settlements.find(s => s.name.replace(/\s+/g, '') === newGuessedLetters);
                if (settlement) {
                  setCurrentScore(prevScore => prevScore + settlement.score);
                }
                
                setDisplayAlertMessage(`המחשב השלים את המילה: "${newGuessedLetters}"! מתחילים מילה חדשה.`); 
                setGuessedLetters(""); 
                setCurrentTrieNode(trie); 
                setIsPlayerTurn(true); 
                setDisplayMessage("...הזן אות ראשונה למילה חדשה"); 
            } else {
                setDisplayMessage(`המחשב התחיל מילה חדשה עם: <span style="color: red;">${char}</span>. תורך.`); 
                setIsPlayerTurn(true); 
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
          setCurrentTrieNode(trie); 
          setGuessedLetters("");
          setIsPlayerTurn(true);
          setDisplayMessage("לחץ שלח כדי להתחיל משחק חדש!");
        }
      }
    };

    if (!isPlayerTurn && isGameActive) {
      handleComputerTurn();
    }
  }, [isPlayerTurn, isGameActive, currentTrieNode, guessedLetters, trie, settlements]);

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

  if (currentGuess.length === 1 && trie && currentTrieNode && settlements) {
    const inputChar = currentGuess;

    const isCurrentNodeEndOfWord = currentTrieNode.isEndOfWord;
    
    // שינוי: השתמש בפונקציה החדשה
    const nextNode = findNextNode(currentTrieNode, inputChar);
    const actualChar = getActualChar(currentTrieNode, inputChar);
    const canContinuePath = !!nextNode;

    if (canContinuePath && actualChar) {
      // שינוי: השתמש באות האמיתית שנמצאה בעץ
      const newGuessedLetters = guessedLetters + actualChar;
      setGuessedLetters(newGuessedLetters);
      setCurrentTrieNode(nextNode);
      setDisplayMessage("...הזן את האות הבאה");
      setDisplayAlertMessage("");

      if (nextNode.isEndOfWord) {
        // מציאת הניקוד של היישוב והוספתו
        const settlement = settlements.find(s => s.name.replace(/\s+/g, '') === newGuessedLetters);
        if (settlement) {
          setCurrentScore(prevScore => prevScore + settlement.score);
        }
        
        setDisplayAlertMessage(`המילה "${newGuessedLetters}" הושלמה! תור המחשב.`);
        setIsPlayerTurn(false);
      } else {
        setIsPlayerTurn(false); 
      }

    } else {
      // שינוי: גם כאן השתמש בפונקציה החדשה לבדיקת תחילת מילה חדשה
      const newWordNode = findNextNode(trie, inputChar);
      const newWordActualChar = getActualChar(trie, inputChar);

      if (isCurrentNodeEndOfWord && newWordNode && newWordActualChar) {
        setCurrentTrieNode(newWordNode); 
        setGuessedLetters(newWordActualChar); // השתמש באות האמיתית
        setDisplayMessage(`מילה חדשה התחילה: '${newWordActualChar}'. תור המחשב...`);
        setDisplayAlertMessage("");
        setIsPlayerTurn(false);
      } else {
        const suggestedWord = getRandomWordFromNode(currentTrieNode, guessedLetters); 

        let message = `יצאת בור!`;
        if (suggestedWord) {
            message += ` העיר שאני חשבתי עליה היא ${suggestedWord}`;
        } else {
            message += ` לא מצאתי מילה שהתחילה בקידומת "${guessedLetters}" במצב זה.`;
        }
        
        setDisplayAlertMessage(message); 

        setCurrentTrieNode(trie); 
        setGuessedLetters(""); 
        setCurrentGuess("");
        setIsPlayerTurn(true); 
        setDisplayMessage("...הזן אות ראשונה"); 
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

  const chooseComputerMove = (node, trieInstance) => {
    if (!node) {
      console.log("chooseComputerMove: node אינו קיים.");
      return null;
    }

    const possibleContinuations = Object.keys(node).filter(key => key !== 'isEndOfWord');
    const isCurrentNodeEndOfWord = !!node.isEndOfWord; 

    const choices = [];

    possibleContinuations.forEach((char) => {
      if (node[char]) { 
        choices.push({ char, action: "continue" });
      }
    });

    if (isCurrentNodeEndOfWord && trieInstance) { 
      const possibleNewWordStarts = Object.keys(trieInstance).filter(key => key !== 'isEndOfWord');
      possibleNewWordStarts.forEach((char) => {
        if (trieInstance[char]) { 
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
      {/* תצוגת הניקוד החדשה */}
      <h2 style={{ color: "purple" }}>הניקוד שלך במשחק זה: {currentScore}</h2>
      
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