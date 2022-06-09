const nodemailer = require('nodemailer');
require("dotenv").config();

let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
})

module.exports = {transporter }