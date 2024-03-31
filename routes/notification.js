var express = require('express');
const nodemailer = require("nodemailer");
var router = express.Router();
require("dotenv").config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORP,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});



router.get("/send", async (req, res) => {

    const mailOptions = {
        from: "singhrajanish31@gmail.com",
        to: "singhrajanish31@gmail.com",
        subject: "test message",
        html: "Test Message",
    };

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Email sent: %s", info.messageId);
         res.send("send email ...");
    }
    });

});


module.exports = router;



