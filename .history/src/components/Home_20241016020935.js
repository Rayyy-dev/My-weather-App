import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const [city, setCity] = useState("");
    const navigate = useNavigate();

    // Handle city search and redirect to WeatherPage
    const handleSearch = (e) => {
        e.preventDefault();
        if (city) {
            navigate(`/weather/${city}`);
        }
    };

    return (
        <div className="home-container">
            <h1>Welcome to Weather Finder</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    required
                />
                <button type="submit">Search Weather</button>
            </form>
        </div>
    );
}

export default Home;
