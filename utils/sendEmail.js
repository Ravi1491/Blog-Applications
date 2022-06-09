const nodemailer = require('nodemailer');
require("dotenv").config();

let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
})

let messageOptions = {
    from: process.env.SENDER_EMAIL,
    to: 'ravi149185@gmail.com',
    subject: 'Blog APP',
    text: 'Hi there. This email was automatically sent by us.'
}

transporter.sendMail(messageOptions, function(err, info){
    if(err){
        return console.log(err);
    }else{
        console.log('Email sent successfully')
    }
})
