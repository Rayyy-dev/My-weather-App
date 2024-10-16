import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import WeatherPage from './components/WeatherPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="logo">MyWeatherApp</div>
          <input type="text" placeholder="Search city..." className="search-bar" />
          <div className="location-menu">
            <button className="current-location-btn">Current Location</button>
            <button className="add-location-btn">Add Location</button>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather/:city" element={<WeatherPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
