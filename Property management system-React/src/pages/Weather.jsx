import React, { useState } from 'react';

export default function WeatherForecast() {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    setWeather([]);
    try {
      const response = await fetch('https://localhost:7067/WeatherForecast', {
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Weather Forecast</h2>
      <button className="btn btn-primary mb-3" onClick={fetchWeather} disabled={loading}>
        {loading ? 'Loading...' : 'Get Weather Forecast'}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {weather.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Temperature (°C)</th>
                <th>Temperature (°F)</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {weather.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.date}</td>
                  <td>{item.temperatureC}</td>
                  <td>{item.temperatureF}</td>
                  <td>{item.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
 