"use strict";

let convert = require('convert-zip-to-gps');

module.exports.handler = async function getGpsFromZip(event, context) {
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
    
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          zipCode,
          lat,
          long
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
