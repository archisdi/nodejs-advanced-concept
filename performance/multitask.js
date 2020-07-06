// process.env.UV_THREADPOOL_SIZE = 5;

const cryto = require('crypto');
const https = require('https');
const fs = require('fs');

const start = Date.now();

function doHash() {
  // handled by libuv with thread pool
  cryto.pbkdf2('a', 'b', 100000, 512,'sha512', () => {
    console.log(`hash: ${Date.now() - start}`);
  });
}

function doRequest() {
  // http request is low level and done by operating system, passed by libuv from v8
  https.request('https://www.google.com', res => {
    res.on('data', () => {});
    res.on('end', () => {
      console.log(`http: ${Date.now() - start}`);
    });
  }).end();
}

function doLoad() {
  fs.readFile('multitask.js', 'utf8', () => {
    console.log(`file: ${Date.now() - start}`);
  });
}

// invocations
doRequest(); // OS
doLoad(); // TP
doHash(); // TP
doHash(); // TP
doHash(); // TP
doHash(); // TP
