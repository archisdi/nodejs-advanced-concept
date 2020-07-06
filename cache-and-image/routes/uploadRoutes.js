const Storage = require('../singletons/storage');
const requireLogin = require('../middlewares/requireLogin');
const uuid = require('uuid');
const Config = require('../config/keys');

module.exports = app => {
    app.get('/api/upload', requireLogin, async (req, res) => {
        try {
            console.log('GENERATING');
        
            const { query: { content_type } } = req;
    
            const fileExt = content_type.split('/')[1];
            const fileName = `${uuid.v4()}.${fileExt}`;

            const storage = await Storage.getInstance();
            
            const config = {
                action: 'write',
                expires: Date.now() + 1000 * 60 * 60,
                version: 'v2',
                contentType: content_type
            };
            const [signedUrl] = await storage
                .bucket(Config.bucket)
                .file(fileName)
                .getSignedUrl(config);

            return res.status(200).send({ key: fileName, url: signedUrl });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    });
}