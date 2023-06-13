"use strict";

const convert = require('convert-zip-to-gps');
const SunCalc = require('suncalc');

module.exports.handler = async function getSunsetFromZip(event, context) {
  const { zipCode }  =  event.pathParameters;
  let statusCode;
  try {
    const raw = convert.zipConvert(zipCode);
    const [ lat, long ] = raw.split(',');
    
    if (!lat || !long ) {
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            message: `No GPS coordinates were found for zip code: ${zipCode}`
          }
        )
      };
    }

    const solar = SunCalc.getTimes(new Date(), lat, long);
    console.log(solar);
    
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          zipCode,
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
