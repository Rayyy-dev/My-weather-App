import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import WeatherPage from "./components/WeatherPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<Home />} />

        {/* Weather Details Page Route */}
        <Route path="/weather/:city" element={<WeatherPage />} />
      </Routes>
    </Router>
  );
}

export default App;
