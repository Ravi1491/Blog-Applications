const express = require("express");
const router = express.Router();
const { authRole } = require("../middleware/auth");
const { authenticateToken } = require("../middleware/jwtToken");
const { userSchemaValidator } = require("../validations/schemaValidator");
const logger = require('../../utils/logger')
const blog = require("../models").blog;
const users = require("../models").users;
const redisClient = require("../../utils/redis.js");
const {customRedisRateLimiter} = require('../middleware/rateLimiter')

const DEFAULT_EXPIRATION = 3600;

// admin get the list of all basic users
router.get("/getAllUser/:id", authRole('admin'), authenticateToken, customRedisRateLimiter({ secondsWindow: 5, allowedHits: 1 }), async (req, res) => {
  try{
    let data = await redisClient.get("getUsers");

    if (data) {
      return res.json(JSON.parse(data));
    } 
    else {
      await users.findAll({ where: { 
        role: "basic" 
      }})
      .then((user) => {
        redisClient.setEx("getAllUser",DEFAULT_EXPIRATION,JSON.stringify(user));
        res.status(200).send(user);
      })
    }
  }
  catch(err){
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

// admin - get all users blogs
router.get("/getAllBlogs/:id", authRole('admin'), authenticateToken, async (req, res) => {
  try{
    let data = await redisClient.get("getallblog");

    if (data) {
      return res.json(JSON.parse(data));
    } 
    else {
      await blog.findAll()
        .then((data) => {
          redisClient.setEx("getAllBlogs",DEFAULT_EXPIRATION,JSON.stringify(data));
          res.status(200).send(data);
        })
    }
  }
  catch(err){
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }  
});

// admin update non-admin data
router.put("/updateUser/:id", authRole('admin'), authenticateToken, userSchemaValidator, async (req, res) => {
  try{
    const user_id = req.body.id;
    await users.findOne({ where: { id: user_id, role: 'basic' } })
    .then( async (finduser)=>{
      if(!finduser){
        return res.sendStatus(404);
      }
      
      const data = {
        name: req.body.name,
        email: req.body.email,  
      };

      await users.update(data, { where: { id: user_id } })
      .then((value) => {
        res.status(200).send(`Data get Updated of ${data.name} `)
      })
    })
  }
  catch(err){
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

//  admin delete non-admin data
router.delete("/deleteUser/:id", authRole('admin'), authenticateToken, userSchemaValidator, async (req, res) => {
  try {
    const delete_id = req.body.id;
    await users.findOne({ where: { id: delete_id, role: "basic" } })
      .then(async (user) => {
        if (!user) {
          return res.status(404).send("No User Found");
        }

        blog.findOne({ where: { userId: delete_id } })
          .then(async (blogData) => {
            if (!blogData) {
              users.destroy({ where: { id: delete_id } }).then((value) => {
                return res.status(200).send(`Data get Deleted `);
              });
            }
            else{
              blog.destroy({ where: { userId: delete_id } }).then(() => {
                users.destroy({ where: { id: delete_id } }).then((value) => {
                  return res.status(200).send(`User and his blogs get Deleted `);
                });
              });
            }
          });
      });
  } 
  catch (err) {
    logger.blog_logger.log("error", "Error: ", err);
    res.status(500).send(err);
  }
});

module.exports = router;
