#!/usr/bin/env node

'use strict';

import { handler } from "../handlers/getSunsetFromZip.js";

const eventObj = {
  pathParameters: {
    zipCode: 33604
  }
};

async function main() {
  const result = await handler(eventObj);
  console.log(result);
}

main();
