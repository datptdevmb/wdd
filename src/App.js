import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import CameraComponent from "./Camera";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camera" element={<CameraComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
