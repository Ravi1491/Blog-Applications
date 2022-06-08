const express = require("express");
const router = express.Router();
const { authAdmin } = require("../middleware/auth");
const { authenticateToken } = require("../middleware/jwtToken");
const { adminUpdateUserValidator, admindeleteUserValidator } = require("../validations/user");
const logger = require('../../utils/logger')
const blog = require("../models").blog;
const users = require("../models").users;
const redisClient = require("../../utils/redis.js");

const DEFAULT_EXPIRATION = 3600;

// admin get the list of all basic users
router.get("/getUsers/:id", authAdmin(), authenticateToken, async (req, res) => {
  let data = await redisClient.get("getUsers");

  if (data) {
    return res.json(JSON.parse(data));
  } else {
    await users.findAll({ where: { role: "basic" } })
      .then((user) => {
        redisClient.setEx("getUsers",DEFAULT_EXPIRATION,JSON.stringify(user));
        res.status(200).send(user);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
});

// admin - get all blogs
router.get("/getallblog/:id", authAdmin(), authenticateToken, async (req, res) => {
  let data = await redisClient.get("getallblog");

  if (data) {
    return res.json(JSON.parse(data));
  } else {
    await blog.findAll()
      .then((data) => {
        redisClient.setEx("getallblog",DEFAULT_EXPIRATION,JSON.stringify(data));
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
});

// admin update non-admin data
router.put("/updateUser/:id", authAdmin(), authenticateToken, adminUpdateUserValidator, async (req, res) => {
  const update_id = req.body.id;
  let finduser = await users.findOne({ where: { id: update_id } });
  finduser = finduser.toJSON();

  if (finduser.role !== "admin"){
    const data = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
    };
    await users.update(data, { where: { id: update_id } })
      .then((value) => {
        blog.update(data, { where: { id: update_id } })
        res.status(200).send(`Data get Updated of ${data.name} `)
      })
      .catch((err) => {
        logger.blog_logger.log('error',"Error: "+err)
        res.status(400).send(err);
      });
    } else {
      res.status(403).send("you cannot delete other Admin user ");
    }
  });

  //  admin delete non-admin data
  router.delete("/deleteUser/:id", authAdmin(), authenticateToken, admindeleteUserValidator, async (req, res) => {
  const delete_id = req.body.id;
  let finduser = await users.findOne({ where: { id: delete_id } });
  finduser = finduser.toJSON();
  
  if (finduser.role !== "admin") {
    await users.destroy({ where: { id: delete_id } })
    .then((value) => {
      blog.destroy({ where: { id: delete_id } })
      res.status(200).send(`Data get Deleted of ${finduser.name}`)
    })
    .catch((err) => {
      logger.blog_logger.log('error',"Error: "+err)
      res.status(400).send(err);
    });
  } else {
    res.send("you cannot delete other Admin user ");
  }
});

module.exports = router;
