// src/pages/gamePage.jsx

import { useState, useEffect, useRef } from "react";
import { useTrie } from "../contexts/TrieProvider";

function GameLogic() {
  const [guessedLetters, setGuessedLetters] = useState("");
  const [displayMessage, setDisplayMessage] = useState("...הזן אות ראשונה");
  const [displayAlertMessage, setDisplayAlertMessage] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");

  const [currentTrieNode, setCurrentTrieNode] = useState(null); // נתחיל עם null ונאתחל ב-useEffect

  const trie = useTrie();
  const inputRef = useRef(null); // זהו ה-ref שיתייחס לתיבת הקלט

  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // האם זה תור השחקן?
  const [isGameActive, setIsGameActive] = useState(false); // האם המשחק פעיל?

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
      setCurrentTrieNode(trie); // מאתחל את הצומת הנוכחי לשורש ה-Trie
      setIsPlayerTurn(true); // וודא שהתור הראשון הוא של השחקן
      setIsGameActive(true); // הפעל את המשחק
    } else {
      console.log("GamePage.jsx: ממתין ל-Trie דרך useTrie...");
      setDisplayMessage("...טוען נתוני משחק");
      setIsGameActive(false); // המשחק לא פעיל עד שה-Trie נטען
    }
  }, [trie]);

  useEffect(() => {
    const handleComputerTurn = async () => {
      // ודא שזה תור המחשב, שהמשחק פעיל ושה-Trie והצומת הנוכחי זמינים
      if (!isPlayerTurn && isGameActive && currentTrieNode && trie) {
        setDisplayMessage("...תור המחשב");
        setDisplayAlertMessage(""); // נקה הודעות קודמות

        // ניתן להוסיף השהיה קצרה (לדוגמה, שנייה) כדי לדמות "חשיבה" של המחשב
        await new Promise((resolve) => setTimeout(resolve, 1000)); // השהיה של 1.5 שניה

        const computerMove = chooseComputerMove(currentTrieNode, trie); // השתמש בפונקציה החדשה

        if (computerMove) {
          const { char, action } = computerMove;

          if (action === "continue") {
            // המחשב ממשיך את המילה הנוכחית
            const newGuessedLetters = guessedLetters + char;
            setGuessedLetters(newGuessedLetters);
            setCurrentTrieNode(currentTrieNode[char]); // עדכן את הצומת
            setDisplayMessage(`המחשב בחר: ${char}`);
            setDisplayMessage(
              `המחשב בחר: <span style="color: red;">${char}</span>`
            );
          } else if (action === "new_word") {
            // המחשב מתחיל מילה חדשה
            const newGuessedLetters = guessedLetters + char;
            setGuessedLetters(newGuessedLetters);
            setCurrentTrieNode(trie[char]); // התקדמות לצומת של האות הראשונה של המילה החדשה
          }

          setIsPlayerTurn(true); // החזר את התור לשחקן
          //if (inputRef.current) { inputRef.current.focus(); } // החזר פוקוס לשחקן

          await new Promise((resolve) => setTimeout(resolve, 50)); // השהיה קצרה מאוד
          if (inputRef.current) {
            inputRef.current.focus(); // החזר פוקוס לשחקן
          }
          setCurrentGuess(""); // וודא ששדה הקלט ריק עבור השחקן
        } else {
          // המחשב לא מצא אות להמשיך או להתחיל (נגמרו האפשרויות)
          setDisplayAlertMessage(`המחשב נכנע! אין לו יותר מהלכים. ניצחת!`);
          setIsGameActive(false); // סיים את המשחק
          setCurrentTrieNode(trie); // אפס את ה-Trie לשורש
          setGuessedLetters(""); // אפס אותיות
          setIsPlayerTurn(false); // וודא שהמשחק נעצר
        }
      }
    };

    // הפעל את תור המחשב כאשר isPlayerTurn הופך ל-false
    if (!isPlayerTurn && isGameActive) {
      handleComputerTurn();
    }
  }, [isPlayerTurn, isGameActive, currentTrieNode, guessedLetters, trie]); // הוסף את כל התלויות

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
    if (!isPlayerTurn || !isGameActive) {
      // אם לא תור השחקן או שהמשחק לא פעיל, אל תעשה כלום
      return;
    }

    if (currentGuess.length === 1 && trie && currentTrieNode) {
      const char = currentGuess;

      const isCurrentNodeEndOfWord = !!currentTrieNode.isEndOfWord; // האם זה סוף מילה?
      const nextNode = currentTrieNode[char]; // מה האות הבאה במידה וקיימת?
      const canContinuePath = !!nextNode; //האם יש אות הבאה?

      if (canContinuePath) {
        const newGuessedLetters = guessedLetters + char;
        setGuessedLetters(newGuessedLetters);
        setCurrentTrieNode(nextNode);
        //setDisplayMessage("...הזן את האות הבאה");
        setDisplayAlertMessage("");

        setIsPlayerTurn(false); // העבר תור למחשב
        setCurrentGuess(""); // נקה קלט שחקן
      } else {
        const charExistsInRoot = !!trie[char]; // האם האות שהוזנה קיימת כילד של השורש?

        if (isCurrentNodeEndOfWord && charExistsInRoot) {
          // השחקן סיים מילה קודמת והתחיל חדשה
          setCurrentTrieNode(trie[char]);
          const newGuessedLetters = guessedLetters + char;
          setGuessedLetters(newGuessedLetters); //
          //setDisplayMessage(`המילה "${guessedLetters}" הסתיימה. התחלת מילה חדשה: '${char}'. תור המחשב...`);
          setDisplayAlertMessage("");
          setIsPlayerTurn(false); // העבר תור למחשב
          setCurrentGuess("");
        } else {
          // מהלך שגוי של השחקן - איפוס
          setDisplayMessage(
            `<span style="color: blue;">איזה לוזרררר. התחל מחדש</span>`
          );
          setCurrentTrieNode(trie); // אפס לשורש
          setGuessedLetters(""); // אפס מילה
          setCurrentGuess("");
          // התור נשאר אצל השחקן להתחיל מחדש
          //setDisplayMessage("...הזן אות ראשונה");
          setDisplayAlertMessage("");
        }
      }
    } else if (currentGuess.length === 0) {
      setDisplayAlertMessage("נא להזין אות");
      setCurrentGuess("");
    } else {
      setDisplayAlertMessage("שגיאה: נתוני המשחק לא נטענו כראוי או קלט שגוי.");
      setCurrentGuess("");
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /*
  const handleSubmitLetter = () => {
    if (currentGuess.length === 1 && trie && currentTrieNode) {
      const char = currentGuess;

      // 1. נבדוק קודם כל אם הצומת הנוכחי (לפני הוספת התו) מסמן סוף מילה
      const isCurrentNodeEndOfWord = !!currentTrieNode.isEndOfWord;

      // 2. ננסה להתקדם עם התו שהוזן
      const nextNode = currentTrieNode[char];
      const canContinuePath = !!nextNode; // האם התו הזה ממשיך את הקידומת הנוכחית?

      if (canContinuePath) {
        // המקרה הנפוץ: האות ממשיכה את המילה הנוכחית
        const newGuessedLetters = guessedLetters + char;
        setGuessedLetters(newGuessedLetters);
        setCurrentTrieNode(nextNode); // מתקדמים לצומת הבא
        setDisplayMessage("...הזן את האות הבאה");
        setDisplayAlertMessage("");

        // אם הצומת הבא (החדש) הוא סוף מילה, ניתן להציג הודעה מיוחדת
        if (nextNode.isEndOfWord) {
            setDisplayMessage("...הזן את האות הבאה");
        }

      } else {
        // המקרה השני: האות לא ממשיכה את המילה הנוכחית
        // כאן נבדוק אם אולי המשתמש סיים מילה חוקית (isEndOfWord) ופשוט רצה להתחיל חדשה עם התו הנוכחי
        // או שזה פשוט תו לא נכון שצריך לאפס
        
        const charExistsInRoot = !!trie[char]; // האם האות יכולה להתחיל מילה חדשה?

        if (isCurrentNodeEndOfWord && charExistsInRoot) {
            // המילה הקודמת הושלמה, והתו החדש יכול להתחיל מילה חדשה.
            // נאפס את currentTrieNode לשורש, ונתחיל מילה חדשה.
            setCurrentTrieNode(trie[char]); // מתחילים מהצומת של האות החדשה בשורש
            const newGuessedLetters = guessedLetters + char;
            setGuessedLetters(newGuessedLetters);            setDisplayMessage("...הזן את האות הבאה");
            setDisplayAlertMessage("");
        } else {
            // האות לא ממשיכה את המילה הנוכחית, וגם לא יכולה להתחיל מילה חדשה (או שהמילה הקודמת לא הושלמה)
            // זהו מצב של טעות - נאפס הכל
            setDisplayAlertMessage("איזה לוזרררר. התחל מחדש");
            setCurrentTrieNode(trie); // אפס לשורש
            setGuessedLetters(""); // אפס את המילה שניחשו
            // setCurrentGuess('') is handled below
        }
      }
      
      setCurrentGuess(""); // מאפסים את שדה הקלט
    } else if (currentGuess.length === 0) {
      setDisplayAlertMessage("נא להזין אות");
      setCurrentGuess(""); // וודא שקלט ריק
    } else {
      setDisplayAlertMessage("שגיאה: נתוני המשחק לא נטענו כראוי או קלט שגוי.");
      setCurrentGuess("");
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
*/

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmitLetter();
      event.preventDefault();
    }
  };

  /**
   * בוחר תו אקראי למחשב, או בוחר להתחיל מילה חדשה אם הצומת הנוכחי הוא סוף מילה.
   *
   * @param {Object} currentTrieNode - הצומת הנוכחי בעץ ה-Trie (ייתכן שזה שורש ה-Trie עצמו).
   * @param {Object} trieRoot - שורש ה-Trie, כדי שהמחשב יוכל להתחיל מילה חדשה.
   * @returns {Object|null} - אובייקט המכיל { char: string, action: 'continue' | 'new_word' } או null אם אין אפשרויות.
   */
  const chooseComputerMove = (currentTrieNode, trieRoot) => {
    const possibleContinuations = Object.keys(currentTrieNode).filter(
      (key) => key !== "isEndOfWord"
    );
    const isCurrentNodeEndOfWord = !!currentTrieNode.isEndOfWord; // האם כרגע זה סוף מילה?

    const choices = [];

    // אפשרות 1: המחשב ממשיך את המילה הנוכחית
    possibleContinuations.forEach((char) => {
      choices.push({ char, action: "continue" });
    });

    // אפשרות 2: אם הצומת הנוכחי הוא סוף מילה, המחשב יכול לבחור להתחיל מילה חדשה
    if (isCurrentNodeEndOfWord) {
      // קבל את כל האותיות שיכולות להתחיל מילה חדשה מהשורש
      const possibleNewWordStarts = Object.keys(trieRoot).filter(
        (key) => key !== "isEndOfWord"
      );
      possibleNewWordStarts.forEach((char) => {
        choices.push({ char, action: "new_word" });
      });
    }

    if (choices.length === 0) {
      return null; // אין אפשרויות למחשב
    }

    // בחר מהלך אקראי מבין כל האפשרויות
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

      <h5> נא להכניס אות לא סופית בעברית בלבד*</h5>
      <input
        type="text"
        value={currentGuess}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        maxLength="1"
        placeholder="הכנס אות אחת"
        ref={inputRef}
        disabled={!isPlayerTurn || !isGameActive} // מנוטרל כשזה לא תור השחקן או שהמשחק לא פעיל
        style={{
          fontSize: "34px",
          width: "240px",
          height: "80px",
          textAlign: "center",
          margin: "4px 0",
          backgroundColor: isPlayerTurn && isGameActive ? "#FFF" : "#EEE", // ויזואלית: אפור אם לא פעיל
        }}
        dir="rtl"
      />
      <h3 style={{ color: "red" }}> {displayAlertMessage} </h3>

      <button
        onClick={handleSubmitLetter}
        disabled={!isPlayerTurn || !isGameActive} // מנוטרל כשזה לא תור השחקן או שהמשחק לא פעיל
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
