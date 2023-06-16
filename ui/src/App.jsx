import React, { useState } from 'react';
import littleSun from './assets/images/sun.png';
import littleBird from './assets/images/bird.png';
import Divider from '@mui/material/Divider';
import { TextField } from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe';
import Slider from '@mui/material/Slider';
import { google, outlook, office365, yahoo, ics } from "calendar-link";

import './App.css'

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [sunsetTime, setSunsetTime] = useState('');
  const [duskTime, setDuskTime] = useState('');
  const [currentTimeZone, setCurrentTimeZone] = useState('');
  const [inviteData, setInviteData] = useState('');

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
          setCurrentTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
        },
        (error) => {
          console.error('Error getting GPS coordinates:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser. Please enter your information manually');
    }
  };

  const displayTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { timeZone: currentTimeZone });
  }

  const displayDateTime = (dateString) => {
    const date = new Date(dateString);
    let options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: currentTimeZone,
      timeZoneName: 'short'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }  

  const handleCalculateSunset = () => {
    if (latitude && longitude) {
      const sunsetAPIUrl = `https://api.sunchirp.com/v1/sunset`;
      const postBody = JSON.stringify({
        latitude: latitude,
        longitude: longitude
      });
      fetch(sunsetAPIUrl, {
        method: 'post',
        body: postBody,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setSunsetTime(data.sunset);
          setDuskTime(data.dusk);
          setInviteData({
            title: 'Sunset',
            description: 'Brought to you by SunChirp.com (https://sunchirp.com)',
            start: data.sunset,
            end: data.dusk
          });
        })
        .catch((error) => {
          console.error('Error fetching sunset time:', error);
        });
    } else {
      console.error('Latitude and longitude are required.');
    }
  };

  const handleDownloadICS = (calType) => {
    // Create an .ics file with the sunset time and allow the user to download it
    const filename = 'sunchirp.ics';
    let invitation;
    if (calType === 'Google') {
      invitation = google(inviteData);
    } else if (calType === 'Outlook') {
      invitation = outlook(inviteData);
    } else if (calType === 'Office365') {
      invitation = office365(inviteData);
    } else if (calType === 'Yahoo') {
      invitation = yahoo(inviteData);
    } else  {
      //Default to iCal format/file
      invitation = ics(inviteData);
    }
    const blob = new Blob([invitation], { type: 'text/calenda;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    //const element = document.createElement('a');
    //element.href = invitation;
    //element.download = filename;
    //element.click();
  };

  return (
    <div>
      <div>
        <h1>SunChirp</h1>
        <p>Add the next sunset to your calendar</p>
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
          <h2>Next Sunset Time:</h2>
          <h2>{displayDateTime(sunsetTime)}</h2>
          <button onClick={handleDownloadICS}>Add to Apple Calendar</button>
        </div>
      )}
    </div>
  );
}

export default App;
