// src/game/trie.js

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
            const char = cleanSettlementName[i];

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
 * בודק אם תו מסוים קיים כבן של הצומת הנוכחי ב-Trie.
 *
 * @param {Object} currentNode - הצומת הנוכחי בעץ ה-Trie.
 * @param {string} char - התו לבדיקה.
 * @returns {boolean} - True אם התו קיים כבן של הצומת הנוכחי, אחרת False.
 */
export const isCorrectChar = (currentNode, char) => {
    return !!currentNode[char]; // רק בודק אם התו קיים כבן של הצומת הנוכחי
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
        if (!node[char]) { // גישה ישירה לילד
            return null;
        }
        node = node[char]; // התקדמות לצומת הילד
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
        if (node.isEndOfWord) { //
            return path;
        }

        // קבל את כל המפתחות (האותיות) שהם ילדים חוקיים
        // מסננים את המאפיין 'isEndOfWord' שיושב ישירות על הצומת
        const childrenChars = Object.keys(node).filter(key => key !== 'isEndOfWord'); //

        if (childrenChars.length === 0) {
            return null; // אין לאן להמשיך מהצומת הזה
        }

        // בחר ילד אקראי כדי להמשיך את הנתיב
        const randomIndex = Math.floor(Math.random() * childrenChars.length);
        const nextChar = childrenChars[randomIndex];
        const nextNode = node[nextChar]; // גישה ישירה לילד

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
