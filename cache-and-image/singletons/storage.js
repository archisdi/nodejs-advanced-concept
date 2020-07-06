const { Storage } = require('@google-cloud/storage');

let instance;

exports.init = () => {
    instance = new Storage({
        keyFilename: './storage/service-account.json',
        projectId: 'archisdi',
        promise: global.Promise
    });
}

exports.getInstance = () => {
    if (!instance) {
        exports.init()
    }
    return instance;
}