const express = require("express");
const router = express.Router();
const Queue = require("bull");
const users = require("../models").users;
const { signupEmail, perodicPassChangeEmail } = require("../../utils/sendEmail");
const logger = require('../../utils/logger')

const sendMailQueue = new Queue("Email");

// send test mail to all basic users
router.get("/send", async (req, res) => {
  try {
    let emailArr = [];
    let userWithEmail = await users.findAll({ where: { role: "basic" } });
    data = JSON.stringify(userWithEmail);
    userWithEmail = JSON.parse(data);
    userWithEmail.map((element) => emailArr.push(element.email));
    
    emailArr.map((Email) => {
      console.log(Email)
      const data = {
        email: Email,
        subject: "Test Mail",
        message: "Hii Buddy, You got a message. ",
      };

      const options = {
        delay: 10000,
        attempts: 2,
      };
      sendMailQueue.add(data, options);
    });
    
    sendMailQueue.process(async (job) => {
      return await signupEmail(
        job.data.email,
        job.data.subject,
        job.data.message
      );
    });

    res.status(200).send("Mails Sent Successfully");
  } catch (err) {
    logger.blog_logger.log("error", "Error: ", err);
    res.status(500).send(err);
  }
});

// remainder to change password
router.get("/perodicPassChange", async (req, res) => {
  try {
    let userWithEmail = await users.findAll({ where: { role: "basic" } });
    data = JSON.stringify(userWithEmail);
    userWithEmail = JSON.parse(data);
    let emailArr = [];
    userWithEmail.map((element) => emailArr.push(element.email));

    emailArr.map((Email) => {
      const data = {
        email: Email,
        subject: "Password Exipred",
        message:
          "You have changed your password 1 month ago, For security reason please change your password by clicking on this link ",
      };

      const options = {
        delay: 10000,
        attempts: 2,
      };
      sendMailQueue.add(data, options);
    });

    sendMailQueue.process(async (job) => {
      return await perodicPassChangeEmail(
        job.data.email,
        job.data.subject,
        job.data.message
      );
    });

    res.status(200).send("Mail sent successfully");
  } catch (err) {
    logger.blog_logger.log("error", "Error: ", err);
    res.status(500).send(err);
  }
});

module.exports = router;
