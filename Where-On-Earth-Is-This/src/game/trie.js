// src/game/trie.js - Add this helper function at the top

/**
 * מילון המרה בין אותיות רגילות לאותיות סופיות בעברית
 */
const FINAL_LETTER_MAP = {
    'כ': 'ך',
    'מ': 'ם', 
    'נ': 'ן',
    'פ': 'ף',
    'צ': 'ץ'
};

/**
 * מילון המרה הפוך - מאותיות סופיות לרגילות
 */
const REGULAR_LETTER_MAP = {
    'ך': 'כ',
    'ם': 'מ',
    'ן': 'נ', 
    'ף': 'פ',
    'ץ': 'צ'
};

/**
 * בונה עץ Trie ממערך של אובייקטי יישובים.
 * שמות היישובים מנוקים מרווחים לפני ההוספה לעץ.
 *
 * @param {Array<Object>} settlementsArray - מערך של אובייקטי יישובים, כאשר לכל אובייקט יש מאפיין 'name'.
 * @returns {Object} - אובייקט Trie (מפת JavaScript) המייצג את מבנה העץ.
 */
export const buildTrie = (settlementsArray) => {
    const trie = {}; // צומת השורש הריק של העץ

    // עוברים על כל יישוב במערך
    settlementsArray.forEach(settlementObj => {
        // מנקים את שם היישוב מכל הרווחים (רווח, טאב, וכו')
        const cleanSettlementName = settlementObj.name.replace(/\s+/g, '');

        // מוודאים שהשם אחרי הניקוי אינו ריק
        if (cleanSettlementName.length === 0) {
            return; // אם ריק, מדלגים על יישוב זה
        }

        let currentNode = trie; // מתחילים תמיד מצומת השורש של ה-Trie עבור כל מילה חדשה

        // עוברים על כל אות בשם היישוב הנקי
        for (let i = 0; i < cleanSettlementName.length; i++) {
            let char = cleanSettlementName[i];
            
            // המרה לאות סופית אם זו האות האחרונה בשם
            if (i === cleanSettlementName.length - 1) {
                const finalChar = FINAL_LETTER_MAP[char];
                if (finalChar) {
                    char = finalChar;
                }
            }
            
            // אם הצומת עבור האות הנוכחית עדיין לא קיים כ"ילד" של הצומת הנוכחי
            if (!currentNode[char]) {
                // יוצרים צומת חדש (אובייקט JavaScript ריק) עבור האות
                currentNode[char] = {};
            }
            // עוברים לצומת של האות הנוכחית כדי להמשיך ממנו
            currentNode = currentNode[char];
        }

        // לאחר שעברנו על כל האותיות בשם היישוב,
        // הצומת הנוכחי (currentNode) הוא הצומת האחרון של המילה בעץ.
        // מסמנים את הצומת הזה כנקודת סיום של מילה חוקית.
        currentNode.isEndOfWord = true; //
    });

    return trie; // מחזירים את אובייקט ה-Trie המלא והבנוי
};

/**
 * בודק אם תו מסוים או הגרסה הסופית שלו קיים כבן של הצומת הנוכחי ב-Trie.
 * * @param {Object} currentNode - הצומת הנוכחי בעץ ה-Trie.
 * @param {string} char - התו לבדיקה (אות רגילה).
 * @returns {Object|null} - הצומת הבא אם נמצא, אחרת null.
 */
export const findNextNode = (currentNode, char) => {
    // בדוק אם האות הרגילה קיימת
    if (currentNode[char]) {
        return currentNode[char];
    }
    
    // אם האות יכולה להיות סופית, בדוק גם את הגרסה הסופית
    const finalChar = FINAL_LETTER_MAP[char];
    if (finalChar && currentNode[finalChar]) {
        return currentNode[finalChar];
    }
    
    return null;
};

/**
 * בדיקה משופרת של תו - תומכת באותיות סופיות
 * * @param {Object} currentNode - הצומת הנוכחי בעץ ה-Trie.
 * @param {string} char - התו לבדיקה.
 * @returns {boolean} - True אם התו או הגרסה הסופית שלו קיימים.
 */
export const isCorrectChar = (currentNode, char) => {
    return findNextNode(currentNode, char) !== null;
};

/**
 * מחזירה את התו שבאמת קיים בעץ (רגיל או סופי)
 * * @param {Object} currentNode - הצומת הנוכחי בעץ ה-Trie.
 * @param {string} inputChar - התו שהמשתמש הזין.
 * @returns {string|null} - התו שקיים בפועל בעץ, או null אם לא נמצא.
 */
export const getActualChar = (currentNode, inputChar) => {
    // בדוק אם האות הרגילה קיימת
    if (currentNode[inputChar]) {
        return inputChar;
    }
    
    // בדוק אם הגרסה הסופית קיימת
    const finalChar = FINAL_LETTER_MAP[inputChar];
    if (finalChar && currentNode[finalChar]) {
        return finalChar;
    }
    
    return null;
};

/**
 * מחזירה את הצומת ב-Trie המתאים לקידומת נתונה.
 *
 * @param {Object} rootTrie - שורש ה-Trie.
 * @param {string} prefix - הקידומת לחיפוש.
 * @returns {Object|null} הצומת המתאים לקידומת, או null אם הקידומת לא קיימת.
 */
export const getNodeForPrefix = (rootTrie, prefix) => {
    let node = rootTrie;
    for (let char of prefix) {
        // שימוש בפונקציית findNextNode שתומכת באותיות סופיות
        const nextNode = findNextNode(node, char);
        if (!nextNode) {
            return null;
        }
        node = nextNode;
    }
    return node;
};

/**
 * מחזירה מילה אקראית שלמה שניתן ליצור מהצומת הנתון.
 *
 * @param {Object} startNode - הצומת ממנו מתחילים לחפש מילה.
 * @param {string} currentPath - הקידומת שכבר נבנתה עד startNode.
 * @returns {string|null} מילה אקראית שלמה, או null אם לא נמצאה מילה.
 */
export const getRandomWordFromNode = (startNode, currentPath = '') => {
    if (!startNode) {
        return null;
    }

    // פונקציית עזר רקורסיבית למציאת נתיב אקראי
    const findRandomPath = (node, path) => {
        // אם הצומת הנוכחי הוא סוף מילה, זו אפשרות למילה.
        if (node.isEndOfWord) {
            return path;
        }

        // קבל את כל המפתחות (האותיות) שהם ילדים חוקיים
        // מסננים את המאפיין 'isEndOfWord' שיושב ישירות על הצומת
        const childrenChars = Object.keys(node).filter(key => key !== 'isEndOfWord');

        if (childrenChars.length === 0) {
            return null; // אין לאן להמשיך מהצומת הזה
        }

        // בחר ילד אקראי כדי להמשיך את הנתיב
        const randomIndex = Math.floor(Math.random() * childrenChars.length);
        const nextChar = childrenChars[randomIndex];
        const nextNode = node[nextChar];

        // קריאה רקורסיבית
        return findRandomPath(nextNode, path + nextChar);
    };

    let foundWord = null;
    // ננסה מספר פעמים למצוא מילה כדי להתמודד עם מזל רע בבחירה אקראית
    // (לדוגמה, נתיב אקראי שנבחר עשוי לא להוביל למילה שלמה).
    for (let i = 0; i < 10; i++) { // נסה עד 10 פעמים
        foundWord = findRandomPath(startNode, currentPath);
        if (foundWord) break;
    }
    return foundWord;
};