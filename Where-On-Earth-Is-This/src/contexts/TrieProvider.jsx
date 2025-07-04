/* eslint-disable react/prop-types */
// src/contexts/TrieProvider.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { buildTrie } from '../game/trie'; // ייבוא פונקציית בניית ה-Trie
import allSettlementsData from '../../data/settlements.json'; // ייבוא נתוני היישובים

// 1. יצירת Context
const TrieContext = createContext(null);

// 2. יצירת ה-Provider Component
export const TrieProvider = ({ children }) => {
    const [trie, setTrie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            console.log("TrieProvider: מתחיל אתחול Trie...");
            const builtTrie = buildTrie(allSettlementsData); // בניית ה-Trie
            setTrie(builtTrie); // שומר את ה-Trie שנבנה במצב ה-Provider
            setLoading(false);  // סימון שהטעינה הסתיימה
            console.log("TrieProvider: Trie מאותחל בהצלחה:", builtTrie);
        } catch (err) {
            console.error("TrieProvider: שגיאה באתחול ה-Trie:", err);
            setError("אירעה שגיאה בטעינת נתוני היישובים.");
            setLoading(false);
        }
    }, []); // מערך תלויות ריק [] מבטיח שה-useEffect ירוץ רק פעם אחת

    // הצגת מצב טעינה או שגיאה
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>טוען נתוני יישובים...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
    }

    // מספק את אובייקט ה-Trie לילדים שלו
    return (
        <TrieContext.Provider value={trie}>
            {children}
        </TrieContext.Provider>
    );
};

// 3. יצירת Custom Hook לגישה ל-Trie
export const useTrie = () => {
    const context = useContext(TrieContext);
    if (context === undefined) {
        throw new Error('useTrie must be used within a TrieProvider');
    }
    return context;
};