import { useState, useEffect } from 'react';
import littleSun from './assets/images/sun.png';
import littleBird from './assets/images/bird.png';
import Divider from '@mui/material/Divider';
import { google, outlook, office365, yahoo, ics } from "calendar-link";
import moment from 'moment';

import './App.css'

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [sunriseStart, setSunriseStart] = useState('');
  const [sunriseEnd, setSunriseEnd] = useState('');
  const [sunsetStart, setSunsetStart] = useState('');
  const [sunsetEnd, setSunsetEnd] = useState('');
  const [offsetSunriseStart, setOffsetSunriseStart] = useState('');
  const [offsetSunsetStart, setOffsetSunsetStart] = useState('');
  const [showSunset, setShowSunset] = useState('');
  const [showOffsetSunset, setShowOffsetSunset] = useState('');
  const [currentTimeZone, setCurrentTimeZone] = useState('');
  const [inviteData, setInviteData] = useState('');
  const defaultOffset = 40;
  const [offset, setOffset] = useState(defaultOffset);

  useEffect(() => {
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
          const parsedSunriseStart = moment(data.sunrise);
          setSunriseStart(parsedSunriseStart.toISOString());
          
          const parsedSunriseEnd = moment(data.sunriseEnd);
          setSunriseEnd(parsedSunriseEnd.toISOString());

          const parsedSunsetStart = moment(data.sunsetStart);
          setSunsetStart(parsedSunsetStart.toISOString());

          const parsedSunsetEnd = moment(data.sunset);
          setSunsetEnd(parsedSunsetEnd.toISOString());

          if (offset) {
            setOffsetSunriseStart(parsedSunriseEnd.subtract(offset, 'minutes').toISOString());
            setOffsetSunsetStart(parsedSunsetEnd.subtract(offset, 'minutes').toISOString());
          }
        })
        .catch((error) => {
          console.error('Error fetching sun data:', error);
        });
    }
  }, [latitude, longitude, offset]);
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'latitude') {
      setLatitude(value);
    } else if (name === 'longitude') {
      setLongitude(value);
    } else if (name === 'offset') {
      setOffset(value);
    }
  }

  const handleGetGPS = async () => {
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
    const parsedDate = moment(dateString);
    const jsDateString = parsedDate.toString();
    const date = new Date(jsDateString);
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
    if (sunsetStart && sunsetEnd) {
      const event = {
        title: 'Sunset',
        description: "Brought to you by SunChirp.com\n(https://sunchirp.com)",
        start: sunsetStart,
        end: sunsetEnd
      }
      setShowSunset(true);
      setInviteData({
        appleLink: ics(event),
        googleLink: google(event),
        outlookLink: outlook(event),
        office365Link: office365(event),
        yahooLink: yahoo(event)
      });
    } else {
      console.error('Latitude and longitude are required.');
    }
  }

  const handleCalculateSunsetWithOffset = () => {
    if (sunsetStart && sunsetEnd && offsetSunsetStart) {
      const event = {
        title: 'Sunset Window',
        description: "Brought to you by SunChirp.com\n(https://sunchirp.com)",
        start: offsetSunsetStart,
        end: sunsetEnd
      }
      setShowOffsetSunset(true);
      setInviteData({
        appleLink: ics(event),
        googleLink: google(event),
        outlookLink: outlook(event),
        office365Link: office365(event),
        yahooLink: yahoo(event)
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
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Longitude:
        <input
          type="text"
          name="longitude"
          value={longitude}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <button onClick={handleCalculateSunset}>Calculate Sunset Time</button>
      <Divider variant="middle" color="white"/>
      {showSunset && (
        <div>
          <div className='sunset-date'>{displayDateTime(sunsetStart)}</div>
          <div className='heading'>Add sunset to calendar:</div>
          <button id='appleLink' className='calendar-button' onClick={handleCalendarURL}>Apple</button>
          <button id='googleLink' className='calendar-button' onClick={handleCalendarURL}>Google</button>
        </div>
      )}
      <Divider variant="middle" color="white"/>
      <label>
        Calculate 
        <input
          type="text"
          name="offset"
          value={offset}
          onChange={handleInputChange}
        />
        <div className='feature-text'>minutes before sunset ends</div>
      </label>
      
        <button onClick={handleCalculateSunsetWithOffset}>Calculate Offset Sunset Time</button>
        {showOffsetSunset && (
        <div>
          <div className='sunset-date'>{displayDateTime(offsetSunsetStart)}</div>
          <div className='heading'>Add sunset to calendar:</div>
          <button id='appleLink' className='calendar-button' onClick={handleCalendarURL}>Apple</button>
          <button id='googleLink' className='calendar-button' onClick={handleCalendarURL}>Google</button>
        </div>
      )}
      <Divider variant="middle" color="white"/>
    </div>
  );
}

export default App;
