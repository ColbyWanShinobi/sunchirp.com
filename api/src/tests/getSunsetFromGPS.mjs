#!/usr/bin/env node

'use strict';

import { handler } from "../handlers/getSunsetFromGPS.js";

const eventObj = {
  "version": "2.0",
  "routeKey": "POST /sunset",
  "rawPath": "/sunset",
  "rawQueryString": "",
  "headers": {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "content-length": "54",
    "content-type": "application/json",
    "host": "api.sunchirp.com",
    "user-agent": "PostmanRuntime/7.32.2",
    "x-forwarded-port": "443",
    "x-forwarded-proto": "https"
  },
  "requestContext": {
    "domainName": "api.sunchirp.com",
    "domainPrefix": "api",
    "http": {
      "method": "POST",
      "path": "/sunset",
      "protocol": "HTTP/1.1",
      "userAgent": "PostmanRuntime/7.32.2"
    },
    "routeKey": "POST /sunset",
    "stage": "$default",
    "time": "14/Jun/2023:18:17:10 +0000",
    "timeEpoch": 1686766630012
  },
  "body": "{\n    \"latitude\": \"28.0363008\",\n    \"longitude\": \"-82.5065472\"\n}",
  "isBase64Encoded": false
};

async function main() {
  const result = await handler(eventObj);
  console.log(result);
}

main();
