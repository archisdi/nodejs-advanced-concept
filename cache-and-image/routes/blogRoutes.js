const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const ClearCache = require('../services/cache').clearHash;
const Config = require('../config/keys');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const userId = req.user.id;
    // const redisClient = redis.getInstance();
    // const cachedBlogs = await redisClient.getAsync(userId);
    const  blogs = await Blog.find({ _user: userId }).limit(10).sort().cache({ key: userId });

    // if (!cachedBlogs) {
    //   blogs = await Blog.find({ _user: userId });
    //   await redisClient.setAsync(userId, JSON.stringify(blogs));
    //   console.log('SERVING FROM MONGO');
      
    // } else {
    //   blogs = JSON.parse(cachedBlogs);
    //   console.log('SERVING FROM REDIS');
    // }

    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content, image_url } = req.body;
    const imageUrl = `https://storage.cloud.google.com/${Config.bucket}/${image_url}`; // dont store non app level url
    const blog = new Blog({
      title,
      content,
      image_url: imageUrl,
      _user: req.user.id
    });

    try {
      await Promise.all([
        blog.save(),
        ClearCache(req.user.id)
      ])
      res.status(200).send(blog);
    } catch (err) {
      res.status(400).send(err);
    }
  });
};
