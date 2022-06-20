const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    logger.blog_logger.log("error", "Mail Not connected: ", error);
  } else {
    logger.blog_logger.log("info", "Mail connected: ",success);
  }
});

module.exports = { transporter };
