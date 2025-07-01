import LoginPage from "./pages/loginPage";
import GamePage from "./pages/gamePage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/:game" element={ <GamePage/> } />
        </Routes>
  );
}
export default App;
