const mongoose = require('mongoose');
const redis = require('../singletons/redis');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const query = this.getQuery();
    const collection = this.mongooseCollection.name;

    const key = JSON.stringify({
        ...query,
        collection
    });

    const redisClient = redis.getInstance();
    const cacheValue = await redisClient.hgetAsync(this.hashKey, key);
    if (!cacheValue) {
        const result = await exec.apply(this, arguments);
        await redisClient.hsetAsync(this.hashKey, key, JSON.stringify(result), 'EX', 60);
        return result;
    }

    const vals = JSON.parse(cacheValue);
    if (Array.isArray(vals)) {
        return vals.map(v => new this.model(v))
    }
    return new this.model(vals);
}

module.exports = {
    clearHash(key = '') {
        const redisClient = redis.getInstance();
        return redisClient.delAsync(JSON.stringify(key));
    }
}