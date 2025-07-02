// src/game/trie.js

export const buildTrie = (settlementsArray) => {
    const trie = {}; // זהו צומת השורש הריק - ההתחלה של העץ

    settlementsArray.forEach(settlementObj => {
        const cleanSettlementName = settlementObj.name.replace(/\s+/g, '');

        if (cleanSettlementName.length === 0) {
            return;
        }

        let currentNode = trie; // מתחילים תמיד מהשורש (emptyNode בדוגמה שלך)

        for (let i = 0; i < cleanSettlementName.length; i++) {
            const char = cleanSettlementName[i];

            // אם אין "ילד" (צומת) עבור האות הנוכחית ב-currentNode, ניצור אותו.
            // זה יוצר אובייקטים כמו node_aleph שראית בהסבר
            if (!currentNode[char]) {
                currentNode[char] = {};
            }
            // עוברים לצומת של האות הנוכחית
            currentNode = currentNode[char];
        }

        // כשהלולאה מסתיימת, currentNode הוא הצומת הסופי של המילה.
        // כאן אנחנו מסמנים אותו כסוף מילה, כמו node_yod_of_bari שראית בהסבר.
        currentNode.isEndOfWord = true;
    });

    return trie;
};

// ... כאן יבואו פונקציות עזר נוספות כמו isValidPrefix, getPossibleNextLetters, isWord ...