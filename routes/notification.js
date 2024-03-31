var express = require('express');
const nodemailer = require("nodemailer");
var router = express.Router();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "singhrajanish31@gmail.com",
    pass: "dogdvnygdtydmmti",
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



