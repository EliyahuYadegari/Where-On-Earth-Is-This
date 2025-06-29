// src/App.jsx
import React, { useState, useEffect } from 'react';
// ייבא את קובץ ה-JSON ישירות
import allSettlementsData from '../data/settlements.json';

function App() {
  const [settlements, setSettlements] = useState([]);
  const [specificSettlement, setSpecificSettlement] = useState(null);

  useEffect(() => {
    // טען את כל הנתונים מה-JSON
    setSettlements(allSettlementsData);

    // חפש את "אבירים" מתוך הנתונים
    const avirim = allSettlementsData.find(item => item.name === "אבירים");
    setSpecificSettlement(avirim);

    // אם הקובץ שלך גדול מאוד וטעינה סינכרונית גורמת ל-UI להיתקע,
    // תוכל לדמות טעינה אסינכרונית עם setTimeout (פחות נפוץ לקבצי JSON מקומיים קטנים)
    /*
    const loadDataAsync = async () => {
      // לדוגמה, לדמות השהייה של 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettlements(allSettlementsData);
      const avirim = allSettlementsData.find(item => item.name === "אבירים");
      setSpecificSettlement(avirim);
    };
    loadDataAsync();
    */
  }, []); // ריצה פעם אחת בלבד כשהקומפוננטה נטענת

  return (
    <div>
      <h1>הצגת נתונים מקובץ JSON</h1>

      <h2>פרטי יישוב "אבירים":</h2>
      {specificSettlement ? (
        <div>
          <p>ID: {specificSettlement.id}</p>
          <p>שם: {specificSettlement.name}</p>
          <p>מועצה: {specificSettlement.council}</p>
        </div>
      ) : (
        <p>"אבירים" לא נמצא בנתונים.</p>
      )}

      <hr />

      <h2>כל היישובים:</h2>
      {settlements.length === 0 ? (
        <p>אין נתונים להצגה (או שהקובץ ריק).</p>
      ) : (
        <ul>
          {settlements.map(item => (
            <li key={item.id}>
              <p>ID: {item.id}</p>
              <p>שם: {item.name}</p>
              <p>מועצה: {item.council}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;