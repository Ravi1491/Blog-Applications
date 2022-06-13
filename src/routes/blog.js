const express = require("express");
const router = express.Router();
const { authBasic } = require("../middleware/auth");
const { authenticateToken } = require("../middleware/jwtToken");
const { basicGetBlogValidator, basicBlogValidator, basicDeleteeBlogValidator } = require("../validations/user");
const blog = require("../models").blog;
const logger = require('../../utils/logger')
const redisClient=require('../../utils/redis.js')
const {customRedisRateLimiter} = require('../middleware/rateLimiter')

const DEFAULT_EXPIRATION = 3600

// get all his blog
router.get("/getblogs/:id", authBasic(), authenticateToken , customRedisRateLimiter({ secondsWindow: 5, allowedHits: 1 }) , async (req, res) => {
  let data = await redisClient.get('blogs');

  if(data){
    return res.json(JSON.parse(data))
  }
  else{
    const findPost = await blog.findOne({ where: { id: req.params.id } });
    const postData = findPost.toJSON();
    const post = postData.blog_post;
    let allPost = JSON.parse(post);
    redisClient.setEx('blogs', DEFAULT_EXPIRATION,JSON.stringify(allPost))
    res.status(200).send(allPost);
  }
});

// get his particular blog 
router.get("/blog/:id",authBasic(), authenticateToken , basicGetBlogValidator, customRedisRateLimiter({ secondsWindow: 5, allowedHits: 1 }) , async (req, res) => {
  let data = await redisClient.get('getblog');

  if(data){
    return res.json(JSON.parse(data))
  }
  else{
    const findPost = await blog.findOne({ where: { id: req.params.id } });
    const postData = findPost.toJSON();
    const post = postData.blog_post;
    let allPost = JSON.parse(post);
    allPost = allPost.filter((user) => {
      if (user["title"] === req.body.title) {
        return 1;
      }
    });
    redisClient.setEx('getblog', DEFAULT_EXPIRATION,JSON.stringify(allPost))
    res.status(200).send(allPost);
  }
});

// User create blog
router.post("/create/:id", authBasic("basic"), authenticateToken, basicBlogValidator , customRedisRateLimiter({ secondsWindow: 5, allowedHits: 1 }) , async (req, res) => {
  const id = req.params.id;
  const post_data = await blog.findOne({ where: { id: id } });
  const getEntery = post_data.toJSON();
  let setPost;
  if (post_data.blog_post !== null) {
    let getPost = getEntery.blog_post;
    getPost = JSON.parse(getPost);
    let addObj = { title: req.body.title, content: req.body.post };
    getPost.push(addObj);
    setPost = JSON.stringify(getPost);
  } else {
    let postarray = [];
    let postobj = { title: req.body.title, content: req.body.post };
    postarray.push(postobj);
    setPost = JSON.stringify(postarray);
  }
  blog.update({
    blog_post: setPost,
  },{
    where: { id: id },
  })
  .then( async (data) => {
      console.log("BLOG ")
      getBlogs = await blog.findAll();
      redisClient.setEx("getallblog",DEFAULT_EXPIRATION,JSON.stringify(getBlogs));
      let onlyBlog = await blog.findOne({where: {id: id}})
      onlyBlog = onlyBlog.toJSON()
      redisClient.setEx("blogs",DEFAULT_EXPIRATION,onlyBlog.blog_post);
      res.status(200).send("Blog Created successfully");
    })
    .catch((err) => {
      res.send(" Error ");
    });
});

// user can update blog
router.put("/updateBlog/:id", authBasic("basic"),authenticateToken, basicBlogValidator , customRedisRateLimiter({ secondsWindow: 5, allowedHits: 1 }) , async (req, res) => {
  const findPost = await blog.findOne({ where: { id: req.params.id } });
  const postData = findPost.toJSON();
  const getPost = postData.blog_post;
  let updated_post = JSON.parse(getPost);
  updated_post.map((user) => {
    if (user["title"] === req.body.title) {
      user["content"] = req.body.post;
    }
  });

  updated_post = JSON.stringify(updated_post);
  await blog.update(
    {
      id: req.params.id,
      name: postData.name,
      blog_post: updated_post,
    },{ 
      where: { id: req.params.id } 
    })
    .then( async (data) => {
      getBlogs = await blog.findAll();
      redisClient.setEx("getallblog",DEFAULT_EXPIRATION,JSON.stringify(getBlogs));
      res.status(200).json({
        message: "Blog updated successfully",
        blog: data,
      });
    })
    .catch((err) => {
      logger.blog_logger.log('error','Error: ',err)
      res.status(400).send(err);
    });
});

// user delete his blog
router.delete("/deleteBlog/:id", authBasic("basic"), authenticateToken, basicDeleteeBlogValidator, customRedisRateLimiter({ secondsWindow: 5, allowedHits: 1 }) , async (req, res) => {
  const title = req.body.title;
  let findblog = await blog.findOne({ where: { id: req.params.id } });
  findblog = findblog.toJSON();
  var findblogpost = findblog.blog_post;
  post = JSON.parse(findblogpost);

  let findTitle = post.filter((user) => {
    if (user["title"] !== title){
      return true;
    }
  });
  let updatetitle = JSON.stringify(findTitle);

  await blog.update(
    {
      id: req.params.id,
      name: findblog.name,
      blog_post: updatetitle,
    },{ 
      where: { id: req.params.id } 
    })
    .then((data) => {
      res.status(200).json({
        message: "Blog deleted successfully",
        blog: data,
      });
    })
    .catch((err) => {
      logger.blog_logger.log('error','Error: ',err)
      res.status(400).send(err);
    });
});

module.exports = router;