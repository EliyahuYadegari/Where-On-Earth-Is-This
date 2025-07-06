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
        currentNode.isEndOfWord = true;
    });

    return trie; // מחזירים את אובייקט ה-Trie המלא והבנוי
};


/**
 * בודק אם תו מסוים קיים כבן של הצומת הנוכחי ב-Trie,
 * או אם הצומת הנוכחי הוא סוף מילה, וגם אם אותו תו קיים כבן של שורש ה-Trie.
 *
 * @param {Object} rootTrie - צומת השורש של עץ ה-Trie.
 * @param {Object} currentNode - הצומת הנוכחי בעץ ה-Trie.
 * @param {string} char - התו לבדיקה.
 * @returns {boolean} - True אם התנאים מתקיימים, אחרת False.
 */
export const isCorrectWord  = (rootTrie, currentNode, char) => {
  const charExistsInCurrentNode = !!currentNode[char];
  const isEndOfWord = !!currentNode.isEndOfWord;
  const charExistsInRoot = !!rootTrie[char];

  return (charExistsInCurrentNode || isEndOfWord) && charExistsInRoot;

};