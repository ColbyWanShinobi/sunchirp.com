"use strict";

const convert = require('convert-zip-to-gps');
const SunCalc = require('suncalc');

module.exports.handler = async function getSunsetFromZip(event, context) {
  const { latitude, longitude } = JSON.parse(event.body);
  let statusCode;
  try {
    if (!latitude || !longitude ) {
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            message: `Incomplete GPS Coordinates: ${latitude} - ${longitude}`,
            event
          }
        )
      };
    }

    const solar = SunCalc.getTimes(new Date(), latitude, longitude);
    console.log(solar);
    
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          latitude,
          longitude,
          ...solar
        }
      )
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: error.message || 'Multiversal Anomaly'
        }
      )
    };
  }
}
