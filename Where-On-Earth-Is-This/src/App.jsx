// src/App.jsx

import LoginPage from './pages/loginPage';
import { Routes, Route } from 'react-router-dom';
import { TrieProvider } from './contexts/TrieProvider';
import UserPage from './pages/userPage';

function App() {
    return (
        <div style={{
            display: 'flex',            // מפעיל Flexbox
            justifyContent: 'center',   // ממקם תוכן במרכז אופקית
            alignItems: 'center',       // ממקם תוכן במרכז אנכית
            minHeight: '100vh',         // מבטיח שה-div תופס לפחות את גובה כל המסך
            width: '100vw',             // מבטיח שה-div תופס את רוחב כל המסך
            backgroundColor: '#f0f0f0', // צבע רקע עדין לכל הדף
        }}>
            {/* ***** עוטפים את כל ה-Routes ב-TrieProvider ***** */}
            {/* זה מבטיח שה-Trie יאותחל פעם אחת ויהיה זמין לכל רכיב בתוך הניתוב */}
            <TrieProvider>
                <Routes>
                    <Route path='/' element={<LoginPage />} />
                    {/* אין צורך להעביר את ה-Trie כ-prop כאן! GamePage יקבל אותו מ-useTrie */}
                    <Route path="/:game" element={<UserPage />} />
                </Routes>
            </TrieProvider>
        </div>
    );
}

export default App;