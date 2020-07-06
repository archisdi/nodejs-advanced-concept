const Promise = require('bluebird');
const redis = require('redis');

Promise.promisifyAll(redis);

let instance;

exports.init = () => {
    instance = redis.createClient('redis://127.0.0.1:32770');
}

exports.getInstance = () => {
    if (!instance) {
        exports.init();
    }
    return instance;
}