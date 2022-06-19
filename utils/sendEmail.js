const cron = require("node-cron");
const logger = require("./logger");
const redisClient=require('./redis')
const transporter = require("./emailInfo").transporter;
require("dotenv").config();
const DEFAULT_EXPIRATION = 3600;

let emailList = []

function perodicPassChangeEmail(email, sub, message) {
  cron.schedule("0 0 * * *", function () {
    let mails = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: sub,
      text: message,
    };
    transporter.sendMail(mails, function (err, info) {
        if (err) {
          logger.blog_logger.log("error", "Error: " + err);
        } else {
          logger.blog_logger.log("info", "Email sent successfully");
        }
      }
    );
  });
}

async function signupEmail(email, sub, message) {
  let mails = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: sub,
    text: message
  };

  transporter.sendMail(mails, (err, info) => {
    if (err) {
      logger.blog_logger.log("error", "Error: " + err);
    } else {
      emailList.push(email);
      redisClient.setEx("getEmail",DEFAULT_EXPIRATION,JSON.stringify(emailList));
      logger.blog_logger.log("info", "Email sent successfully");
    }
  });
}

module.exports = { perodicPassChangeEmail, signupEmail };
