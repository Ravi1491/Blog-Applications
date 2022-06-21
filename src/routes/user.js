const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/jwtToken");
const { userSchemaValidator } = require("../validations/schemaValidator");
const users = require("../models").users;
const { signupEmail } = require('../../utils/sendEmail')
const logger = require('../../utils/logger')
const redisClient=require('../../utils/redis.js')
const Queue = require('bull')
const DEFAULT_EXPIRATION = 3600;

// signup
router.post("/signup", userSchemaValidator , async (req, res) => {
  const { name, email, password, role } = req.body;

  try{
    if (!name || !email || !password || !role) {
      return res.status(400).send("Please enter all fields");
    } 
    await users.findOne({ where: { email } })
      .then(async (ExistUser) => {
        if (ExistUser) {
          return res.json({ message: "User with email already exist " });
        }

        await users.create({
          name,
          email,
          password,
          role,
        })
        .then(async (value) => {
          signupEmailData(email);
          getusers = await users.findAll({ where: { role: "basic" } });
          redisClient.setEx("getUsers",DEFAULT_EXPIRATION,JSON.stringify(getusers));
          res.status(200).send(`${name} - Successfully Registered`);
        });
      });
  } 
  catch (err) {
    logger.blog_logger.log("error", "Error: ", err);
    res.status(500).send(err);
  }
});

router.get("/refreshToken/:id", async (req, res) => {
  const id = req.params.id;
  try{
    await users.findOne({ where: { id } })
      .then((user_data)=>{
        
        if (user_data == null) return res.sendStatus(401);
        if (!user_data.refreshtoken) return res.sendStatus(403);

        jwt.verify(user_data.refreshtoken,process.env.REFRESH_TOKEN_SECERT,(err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = generateAccessToken({ email: user.email });
          res.json({ accessToken: accessToken });
        })
      })
  }
  catch(err){
    logger.blog_logger.log("error", "Error: ", err);
    res.status(500).send(err);
  }
});

// login
router.post("/login", userSchemaValidator , async (req, res) => {
  const { email, password } = req.body;
  try {
    await users.findOne({ where: { email } })
      .then(async(userWithEmail)=>{
        if (await bcrypt.compare(password, userWithEmail.password)) {
          const user = { email: userWithEmail.email };
          const accessToken = generateAccessToken(user);
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECERT, {expiresIn: "7d",});
    
          await users.update({
              refreshtoken: refreshToken,
            },{ where: { id: userWithEmail.id } }
          );
          
          res.status(200).json({
            message: `${userWithEmail.name} - Successfully Login`,
            AccessToken: accessToken,
            RefreshToken: refreshToken,
          });
        } else {
          res.status(403).send("Invalid Email or Password");
        }
      }
    )
  } 
  catch(err){
    logger.blog_logger.log("error", "Error: ", err);
    res.status(500).send(err);
  }
});

// changing password
router.put("/changePass", userSchemaValidator, async function (req, res) {
  const { email, oldPassword ,newPassword } = req.body;
  
  try {
    await users.findOne({ where: { email } })
      .then( async (userWithEmail) => {
        if (! await bcrypt.compare(oldPassword, userWithEmail.password)) {
          res.status(400).send(`${userWithEmail.name} - Password does not match `);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await users.update({
            password: hashedPassword,
          },{
            where: { id: userWithEmail.id },
          }
        );
        res.status(200).send(`${userWithEmail.name} - Password changed Successfully `);
      });
  } 
  catch(err) {
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

// logout
router.delete("/logout/:id" , authenticateToken , async (req, res) => {
  try{
    const id = req.params.id;
    await users.findOne({ where: { id } })
      .then(async(user_data)=>{
        if (user_data.refreshtoken) {
          users.update({ refreshtoken: null }, { where: { id } });
        }
        res.status(403).send(` ${user_data.name} Successfully Logout`);
      })
  }
  catch(err){
    logger.blog_logger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

// generate new access token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECERT, { expiresIn: "8h" });
}

function signupEmailData(email){
  const sendMailQueue = new Queue("Email");

  const data = {
    email: email,
    subject: 'Signup',
    message: 'Hii Buddy, You have successfully signup on Blog Application. '
  }

  const options = {
    delay: 60000,
    attempts: 2
  }

  sendMailQueue.add(data,options);
  sendMailQueue.process(async (job) =>{
    return await signupEmail(job.data.email,job.data.subject,job.data.message)
  })
}


module.exports = router;
