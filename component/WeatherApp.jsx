import React, { useState, useEffect } from "react";
import { Container, Form, Button, Image } from "react-bootstrap";

function WeatherApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  const API_KEY = "API_KEY";
  const API_PAGE = "https://api.openweathermap.org";
  const API_URL = `${API_PAGE}/data/2.5/weather?appid=${API_KEY}&units=imperial&q=${searchTerm},US&state=${stateCode}`;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Update search term state with the entered city name
    const city = event.target.elements.city.value.trim();
    const state = event.target.elements.state.value.trim();
    setSearchTerm(city);
    setStateCode(state);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("City not found");
        }
        const data = await response.json();
        setWeatherData(data);
        setLocation({ lat: data.coord.lat, lng: data.coord.lon });
        setError(null);
      } catch (err) {
        setError(err.message);
        setWeatherData(null);
        setLocation({ lat: 0, lng: 0 });
      }
    };
    if (searchTerm) {
      fetchData();
    }
  }, [API_URL, searchTerm]);

  return (
    <Container className="mt-4 p-4 border rounded">
      <h1 className="text-center mb-4">Weather App</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>City:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            name="city"
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>State:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter state code (e.g. CA)"
            name="state"
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Search
        </Button>
      </Form>
      {error && <p className="text-danger">{error}</p>}
      {weatherData !== null && (
        <div className="mt-4 d-flex justify-content-between align-items-center">
          <div className="mt-4">
            <h2>
              {weatherData.name}, {stateCode.toUpperCase()}{" "}
              <Image
                style={{
                  boxShadow: "0 2px 4px rgba(0,0,0,.1)",
                  display: "block",
                  margin: "auto"
                }}
                src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              />
            </h2>
            <p>
              <b>Weather:</b>
              {weatherData.weather[0].description}
            </p>
            <p>
              <b>Temperature:</b> {Math.round(weatherData.main.temp)}°F
            </p>
            <p>
              <b>Feels like:</b> {Math.round(weatherData.main.feels_like)}°F
            </p>
            <p>
              <b>Humidity:</b> {weatherData.main.humidity}%
            </p>
            <p>
              <b>Wind:</b> {weatherData.wind.speed} f/s
            </p>
            <p>
              <b>Pressure:</b> {weatherData.main.pressure} hPa
            </p>
            <p>
              <b>Sunrise:</b>{" "}
              {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
            </p>
            <p>
              <b>Sunset:</b>{" "}
              {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </Container>
  );
}

export default WeatherApp;
