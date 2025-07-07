import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // הוסף את useState ו-useEffect אם הם לא שם
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  doc,
  setDoc,
  serverTimestamp
} from '../firebase';

function LoginPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); //  פרטי המשתמש המחובר
  const [loading, setLoading] = useState(true); // מצב לטעינה ראשונית של אימות

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const userData = {
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'אורח',
          record: 0 // כרגע זה 0, נעדכן כשנקרא מ-Firestore
        };
        sessionStorage.setItem('currentUser', JSON.stringify(userData));

        navigate("/game");
      } else {
        // אם אין משתמש מחובר, ננקה את sessionStorage
        sessionStorage.removeItem('currentUser');
      }
    });

    return () => unsubscribe();
  }, [navigate]);


// שמירת נתוני המשתמש לבסיס הנתונים ויצירת שדה של RECORD לשמירת השיא
  const saveUserDataToFirestore = async (user) => {
    if (user) { // ודא שיש אובייקט משתמש תקין
      try {
        // צור או עדכן מסמך באוסף 'users' עם ה-UID של המשתמש כמזהה המסמך
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email || null, // דוא"ל יהיה זמין למשתמשי גוגל, null לאורחים
          displayName: user.displayName || 'אורח', // שם גלוי למשתמשי גוגל, 'אורח' לאורחים
          lastSignInTime: serverTimestamp(), // חותמת זמן של כניסה אחרונה
          record: 0 // ניקוד התחלתי של 0 לכל משתמש חדש

        }, { merge: true }); // 'merge: true' חשוב - הוא יעדכן רק את השדות שצוינו,
                             // ולא ימחק נתונים קיימים אם המסמך כבר קיים.
        console.log("User data saved to Firestore!");
      } catch (error) {
        console.error("Error writing user document to Firestore: ", error);
      }
    }
  };

const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider); // מנסה להתחבר עם גוגל
    console.log('User signed in with Google:', result.user);
    await saveUserDataToFirestore(result.user); // שומר את פרטי המשתמש ל-Firestore
    // הניווט לדף המשחק יטופל אוטומטית על ידי ה-onAuthStateChanged ב-useEffect
  } catch (error) {
    console.error('Google Sign-in Error:', error.message);
    alert(`שגיאת התחברות עם גוגל: ${error.message}`); // הצג הודעת שגיאה למשתמש
  }
};

const handleAnonymousSignIn = async () => {
  try {
    const result = await signInAnonymously(auth); // מנסה להתחבר כאורח
    console.log('Anonymous user signed in:', result.user);
    await saveUserDataToFirestore(result.user); // שומר את פרטי המשתמש ל-Firestore (גם לאורח)
    // הניווט לדף המשחק יטופל אוטומטית על ידי ה-onAuthStateChanged ב-useEffect
  } catch (error) {
    console.error('Anonymous Sign-in Error:', error.message);
    alert(`שגיאת התחברות כאורח: ${error.message}`); // הצג הודעת שגיאה למשתמש
  }
};


// הצגת הודעת טעינה בזמן שבודקים את מצב האימות
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>טוען...</div>;
  }

  // רק אם המשתמש לא מחובר, הצג את כפתורי ההתחברות
  // אם הוא מחובר, ה-useEffect כבר ינווט אותו לדף המשחק
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "10px",
        border: "3px solid blue",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
        margin: "50px auto"
      }}
    >
      <h1>Where On Earth Is This?!</h1>

      {/* רק אם אין משתמש, הצג את כפתורי ההתחברות */}
      {!user && (
        <>
          <button
            onClick={handleGoogleSignIn}
            style={{
              backgroundColor: "#4285F4",
              color: "white",
              padding: "15px 30px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontSize: "1.1em",
              margin: "10px auto",
              display: "block",
              width: "80%",
              maxWidth: "250px",
            }}
          >
            התחבר עם גוגל
          </button>
          <button
            onClick={handleAnonymousSignIn}
            style={{
              backgroundColor: "#607D8B",
              color: "white",
              padding: "15px 30px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontSize: "1.1em",
              margin: "10px auto",
              display: "block",
              width: "80%",
              maxWidth: "250px",
              marginTop: '15px'
            }}
          >
            כניסה כאורח
          </button>
        </>
      )}
      {/* לא מוצג כלום אם המשתמש מחובר, כי הוא אמור להיות מנווט כבר */}
    </div>
  );
}

export default LoginPage;







