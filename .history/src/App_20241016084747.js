import React, { useState, useEffect } from 'react'
import { Search, MapPin, Droplets, Wind, Thermometer, Sun, Moon, ChevronRight, ChevronLeft } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const apiKey = "74072ad194774534b56234435241510"

export default function WeatherApp() {
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const lastViewedCity = localStorage.getItem('lastViewedCity') || 'New York'
    fetchWeather(lastViewedCity)
  }, [])

  const fetchWeather = async (location) => {
    setLoading(true)
    setError('')
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`),
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10`)
      ])

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const [weatherData, forecastData] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json()
      ])

      setWeather(weatherData)
      setForecast(forecastData.forecast.forecastday)
      localStorage.setItem('lastViewedCity', location)
      setCity(weatherData.location.name)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`)
      const data = await response.json()
      setSuggestions(data)
    } catch (err) {
      console.error('Failed to fetch city suggestions', err)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setCity(value)
    fetchSuggestions(value)
  }

  const handleSearch = (selectedCity) => {
    setCity(selectedCity)
    fetchWeather(selectedCity)
    setSuggestions([])
  }

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme === 'dark' ? 'from-gray-900 to-gray-800 text-white' : 'from-blue-50 to-blue-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Weather App</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </header>

        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Search for a city"
            value={city}
            onChange={handleInputChange}
            className="w-full pr-12"
          />
          <Button
            onClick={() => handleSearch(city)}
            className="absolute right-0 top-0 h-full rounded-l-none"
          >
            <Search size={20} />
          </Button>
          {suggestions.length > 0 && (
            <Card className="absolute z-10 w-full mt-1">
              <CardContent className="p-0">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleSearch(suggestion.name)}
                  >
                    <MapPin size={16} className="mr-2 text-blue-500" />
                    <span>{suggestion.name}, {suggestion.region}, {suggestion.country}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Current Weather</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-5xl font-bold">{Math.round(weather.current.temp_c)}°C</p>
                    <p className="text-xl mt-2">{weather.current.condition.text}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Feels like {Math.round(weather.current.feelslike_c)}°C</p>
                  </div>
                  <img src={weather.current.condition.icon} alt="Weather icon" className="w-24 h-24" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Droplets className="mr-2 text-blue-500" size={20} />
                    <span>{weather.current.humidity}%</span>
                  </div>
                  <div className="flex items-center">
                    <Wind className="mr-2 text-blue-500" size={20} />
                    <span>{Math.round(weather.current.wind_kph)} km/h</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="mr-2 text-blue-500" size={20} />
                    <span>{weather.current.pressure_mb} hPa</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecast.slice(0, 3).map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img src={day.day.condition.icon} alt="Weather icon" className="w-10 h-10 mr-4" />
                        <div>
                          <p className="font-semibold">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{day.day.condition.text}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{Math.round(day.day.maxtemp_c)}°C</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{Math.round(day.day.mintemp_c)}°C</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {forecast.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Detailed Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="hourly">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
                  <TabsTrigger value="tenday">10-Day Forecast</TabsTrigger>
                </TabsList>
                <TabsContent value="hourly">
                  <div className="flex space-x-6 overflow-x-auto py-4">
                    {forecast[0].hour.filter((_, index) => index % 3 === 0).map((hour, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <p className="font-semibold">{new Date(hour.time).getHours()}:00</p>
                        <img src={hour.condition.icon} alt="Weather icon" className="w-10 h-10 my-2" />
                        <p>{Math.round(hour.temp_c)}°C</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="tenday">
                  <div className="space-y-4">
                    {forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="w-24 font-semibold">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                          <img src={day.day.condition.icon} alt="Weather icon" className="w-10 h-10 mx-4" />
                          <p className="w-32 text-sm text-gray-600 dark:text-gray-400">{day.day.condition.text}</p>
                        </div>
                        <div className="flex items-center">
                          <p className="w-16 text-right font-semibold">{Math.round(day.day.maxtemp_c)}°C</p>
                          <p className="w-16 text-right text-gray-600 dark:text-gray-400">{Math.round(day.day.mintemp_c)}°C</p>
                          <ChevronRight size={20} className="ml-2 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}