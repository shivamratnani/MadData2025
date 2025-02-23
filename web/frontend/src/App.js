import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Dreams from "./components/Dreams.tsx";
import About from "./components/About.tsx"

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Route for dashboard */}
        <Route path="/dreams" element={<Dreams />} />
        
        {/* Default route (About) */}
        <Route path="/" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
