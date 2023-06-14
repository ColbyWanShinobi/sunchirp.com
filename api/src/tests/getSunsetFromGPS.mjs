#!/usr/bin/env node

'use strict';

import { handler } from "../handlers/getSunsetFromGPS.js";

const eventObj = {
  body: {
    "latitude": "28.0363008",
    "longitude": "-82.5065472"
  }
};

async function main() {
  const result = await handler(eventObj);
  console.log(result);
}

main();
