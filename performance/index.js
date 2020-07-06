// process.env.UV_THREADPOOL_SIZE = 4;
const crypto = require('crypto');

// const cluster = require('cluster');
// if (cluster.isMaster) {
//   cluster.fork();
//   cluster.fork();
// } else {  

// }

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  crypto.pbkdf2('a', 'b', 100000, 512,'sha512', () => {
    res.json({'message': 'Hi there'});
  });
});

app.get('/fast', (req, res) => {
  res.json({'message': 'gotta go fast'});
});

app.listen(3000);