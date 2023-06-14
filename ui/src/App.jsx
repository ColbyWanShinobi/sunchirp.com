import React, { useState } from 'react';
import littleSun from './assets/images/sun.png';
import littleBird from './assets/images/bird.png';
import Divider from '@mui/material/Divider';
import { TextField } from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe';
import Slider from '@mui/material/Slider';

import './App.css'

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [sunsetTime, setSunsetTime] = useState('');

  const handleLocationChange = (event) => {
    const { name, value } = event.target;
    if (name === 'latitude') {
      setLatitude(value);
    } else if (name === 'longitude') {
      setLongitude(value);
    }
  };

  const handleGetGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting GPS coordinates:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleCalculateSunset = () => {
    if (latitude && longitude) {
      const sunsetAPIUrl = `https://api.sunchirp.com/v1/sunset/`;
      const postBody = JSON.stringify({
        latitude: latitude,
        longitude: longitude
      });
      fetch(sunsetAPIUrl, {
        method: 'post',
        body: postBody,
        headers: {
          'contentType': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          const sunsetTime = data.results.sunset;
          setSunsetTime(sunsetTime);
        })
        .catch((error) => {
          console.error('Error fetching sunset time:', error);
        });
    } else {
      console.error('Latitude and longitude are required.');
    }
  };

  const handleDownloadICS = () => {
    // Create an .ics file with the sunset time and allow the user to download it
    const filename = 'sunset_event.ics';
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${sunsetTime}
DTEND:${sunsetTime}
SUMMARY:Sunset Event
END:VEVENT
END:VCALENDAR`;

    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(icsContent);
    element.download = filename;
    element.click();
  };

  return (
    <div>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <div>
        <h1>SunChirp</h1>
        <img src={littleSun} className="logo-rot" alt="Vite logo" />
        <img src={littleBird} className="logo" alt="React logo" />
        <Divider variant="middle" color="white"/>
      </div>
      <button onClick={handleGetGPS}>Get GPS Coordinates</button>
      <br />
      <label>
        Latitude:
        <input
          type="text"
          name="latitude"
          value={latitude}
          onChange={handleLocationChange}
        />
      </label>
      <br />
      <label>
        Longitude:
        <input
          type="text"
          name="longitude"
          value={longitude}
          onChange={handleLocationChange}
        />
      </label>
      <br />
      <button onClick={handleCalculateSunset}>Calculate Sunset Time</button>
      {sunsetTime && (
        <div>
          <h2>Sunset Time: {sunsetTime}</h2>
          <button onClick={handleDownloadICS}>Download .ics</button>
        </div>
      )}
    </div>
  );
}

export default App;
