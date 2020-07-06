const https = require('https');
const start = Date.now();

function doRequest() {
  // http request is low level and done by operating system, passed by libuv from v8
  https.request('https://www.google.com', res => {
    res.on('data', () => {});
    res.on('end', () => {
      console.log(Date.now() - start);
    });
  }).end();
}

// OSTask Delegations
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
