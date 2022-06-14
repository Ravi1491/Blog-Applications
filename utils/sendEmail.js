const nodemailer = require("nodemailer");
const cron = require("node-cron");
const logger = require("./logger");
const transporter = require("./emailInfo").transporter;
require("dotenv").config();

function messageOptions(email, sub, message) {
  let mails = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: sub,
    text: message,
  };

  return mails;
}

function perodicPassChangeEmail(email, sub, message) {
  cron.schedule("17 17 * * * *", function () {
    const mail = transporter.sendMail(
      messageOptions(email, sub, message),
      function (err, info) {
        if (err) {
          logger.blog_logger.log("error", "Error: " + err);
        } else {
          logger.blog_logger.log("info", "Email sent successfully");
        }
      }
    );
  });
}

function signupEmail(email, sub, message) {
  console.log("inside mail")
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
        logger.blog_logger.log("info", "Email sent successfully");
      }
    }
  );
  const date = new Date();
  console.log(" mail sent", date)
}

module.exports = { perodicPassChangeEmail, signupEmail };
