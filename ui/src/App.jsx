import { useState } from 'react';
import littleSun from './assets/images/sun.png';
import littleBird from './assets/images/bird.png';
import Divider from '@mui/material/Divider';
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
  }

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
  }

  const displayDateTime = (dateString) => {
    const date = new Date(dateString);
    let options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
          const event = {
            title: 'Sunset',
            description: "Brought to you by SunChirp.com\n(https://sunchirp.com)",
            start: data.sunset,
            end: data.dusk
          }
          setInviteData({
            appleLink: ics(event),
            googleLink: google(event),
            outlookLink: outlook(event),
            office365Link: office365(event),
            yahooLink: yahoo(event)
          });
        })
        .catch((error) => {
          console.error('Error fetching sunset time:', error);
        });
    } else {
      console.error('Latitude and longitude are required.');
    }
  }

  const handleCalendarURL = (event) => {
    event.preventDefault();
    window.location.href = inviteData[event.target.id];
  }

  return (
    <div>
      <div>
        <div className='title'>SunChirp</div>
        <p className='subtext'>Add the next sunset to your calendar</p>
        <img src={littleSun} className="logo logo-rot" alt="Sun" />
        <img src={littleBird} className="logo" alt="Bird" />
        <Divider variant="middle" color="white"/>
      </div>
      <button onClick={handleGetGPS}>Get My GPS Coordinates</button>
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
      {sunsetTime && duskTime && (
        <div>
          <div className='heading'>Next Sunset Time:</div>
          <div className='sunset-date'>{displayDateTime(sunsetTime)}</div>
          <div className='heading'>Add this sunset event to your calendar:</div>
          <button id='appleLink' className='calendar-button' onClick={handleCalendarURL}>Apple</button>
          <button id='googleLink' className='calendar-button' onClick={handleCalendarURL}>Google</button>
        </div>
      )}
    </div>
  );
}

export default App;
