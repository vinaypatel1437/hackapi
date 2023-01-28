const express = require("express");
const router = new express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const Users = require("../models/gmail");
const Emails = require("../models/emails");

var transport = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true, //ssl
    auth: {
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});


router.post("/gmail/signup", async (req, res) => {
  try {
    const user = new Users(req.body);
    const createUser = await user.save();
    console.log(createUser);
    res.status(201).send({
      user: createUser,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/gmail/sendemail", async (req, res) => {
  try {
    //Integrate NodeMailer
    var mailOptions = {
        from: process.env.EMAIL,
        to: req.body.senderEmail,
        subject: req.body.subject,
        html: req.body.html,
    };
    let info = transport.sendMail(mailOptions);
    var users = await Email.find({
      senderEmail: req.body.senderEmail,
    });
    //users = JSON.parse(users);
    if (!users.length) {
      var user = new Email({
        senderEmail: req.body.senderEmail,
        email: req.body.email,
        emailData: JSON.stringify([`${req.body.subject} ${req.body.html}]),
      });
      var createUser = await user.save();
      console.log(createUser);
    } else {
      console.log(users[0].message, "Message");
      const messages = [...JSON.parse(users[0].emailData), `${req.body.subject} ${req.body.html}];
      await Email.updateOne(
        { senderEmail: req.body.senderEmail},
        {
          $set: {
            emailData: JSON.stringify(messages),
          },
        }
      );
    }
    res.status(201).send({
      message: 'Email sent successfully',
      success: info,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/gmail/listall", async (req, res) => {
  try {
    //Integrate NodeMailer
    let emails = [];
    const emailData = await Emails.find({ senderEmail: req.body.email });
    res.status(201).send({
      emailData,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/gmail/login", async (req, res) => {
  try {
    let user = {};
    const userData = await Users.find({email : req.body.email});
    if(userData[0].pass===req.body.pass) {
        res.status(200).send({
        user: userData[0],
        message: "Success"
        });
    }
    else {
        res.status(400).send({message: 'Password incorrect'});
    }
    if (userData.length === 0) {
      res.status(400).send("Email incorrect");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
