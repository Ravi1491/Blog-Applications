const express = require("express");
const router = express.Router();
const { authRole } = require("../middleware/auth");
const { authenticateToken } = require("../middleware/jwtToken");
const { blogSchemaValidator } = require("../validations/schemaValidator");
const blog = require("../models").blog;
const logger = require('../../utils/logger')
const redisClient=require('../../utils/redis.js')
const {customRedisRateLimiter} = require('../middleware/rateLimiter')

const DEFAULT_EXPIRATION = 3600

// get all his blog
router.get("/getAllPost/:id", authRole('basic') , authenticateToken, customRedisRateLimiter({ secondsWindow: 5, allowedHits: 1 }), async (req, res) => {
  try{
    let data = await redisClient.get('blogs');

    if(data){
      return res.json(JSON.parse(data))
    } else{
      await blog.findAll({ where: { 
        userId: req.params.id,
      }})
      .then((data)=>{
        let allPostData = []
        
        data.map((item)=>{
          let postData = {
            id: item.id,
            title: item.title,
            post: item.post
          }
          allPostData.push(postData);
        })

        redisClient.setEx('getAllPost', DEFAULT_EXPIRATION,JSON.stringify(allPostData))
        res.status(200).send(allPostData);
      })
    }
  }catch(err){
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

// get his particular blog 
router.get("/getPost/:id", authRole('basic') , authenticateToken, blogSchemaValidator, async (req, res) => {
  try{
    let data = await redisClient.get('getPost');

    if(data){
      return res.json(data)
    } else {
      await blog.findOne({ where: { 
        userId: req.params.id, 
        title: req.body.title 
      }})
      .then((data)=>{
        redisClient.setEx('getPost', DEFAULT_EXPIRATION,data.post)
        res.status(200).send(data.post);
      })
  }}catch(err){
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

// User create blog
router.post("/createPost/:id", authRole('basic') , authenticateToken, blogSchemaValidator, async (req, res) => {
  try{
    const id = req.params.id;
    const title = req.body.title;
    const post = req.body.post;

    await blog.create({
      userId: id,
      title,
      post
    })
    .then((data)=>{
      redisClient.setEx('getAllPost', DEFAULT_EXPIRATION,JSON.stringify(data))
      redisClient.setEx('getPost', DEFAULT_EXPIRATION,data.post)
      res.status(200).send("User Blog Successfully Created")
    })
  }catch(err){
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

// user can update blog
router.put("/updatePost/:id", authRole('basic') , authenticateToken, blogSchemaValidator, async (req, res) => {
  try{
    await blog.findOne({ 
      where: { 
        userId: req.params.id, 
        title: req.body.title 
      }
    }).then(async ()=>{
      await blog.update({
        post: req.body.post
      },{ 
        where: { 
          userId: req.params.id, 
          title: req.body.title  
        }
      })
      .then( async () => {
        getBlogs = await blog.findAll();
        redisClient.setEx("getAllBlogs",DEFAULT_EXPIRATION,JSON.stringify(getBlogs));
        res.status(200).send("Blog updated successfully");
      })
    })
  }catch(err){
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

// user delete his blog
router.delete("/deletePost/:id", authRole('basic') , authenticateToken, blogSchemaValidator, async (req, res) => {
  try{
    console.log(req.params.id);
    await blog.findOne({ 
      where: { 
        userId: req.params.id, 
        title: req.body.title 
      }
    })
    .then( async (data)=>{
      await blog.destroy({ where: { 
        userId: req.params.id, 
        title: req.body.title 
      }})
      .then((datas)=>{
        res.status(200).send("Blog deleted successfully");
      })
    })
  }catch(err){
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

module.exports = router;