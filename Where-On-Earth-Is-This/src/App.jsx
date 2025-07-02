// src/App.jsx

import React from 'react';
import LoginPage from './pages/loginPage';
import GamePage from './pages/gamePage';
import { Routes, Route } from 'react-router-dom';
import { TrieProvider } from './contexts/TrieProvider';

function App() {
    return (
        <>
            {/* ***** עוטפים את כל ה-Routes ב-TrieProvider ***** */}
            {/* זה מבטיח שה-Trie יאותחל פעם אחת ויהיה זמין לכל רכיב בתוך הניתוב */}
            <TrieProvider>
                <Routes>
                    <Route path='/' element={<LoginPage />} />
                    {/* אין צורך להעביר את ה-Trie כ-prop כאן! GamePage יקבל אותו מ-useTrie */}
                    <Route path="/:game" element={<GamePage />} />
                </Routes>
            </TrieProvider>
        </>
    );
}

export default App;