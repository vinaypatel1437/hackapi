const express = require("express");
const router = new express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const Users = require("../models/users");
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

router.get("/gmail/sendemail", async (req, res) => {
  try {
    //Integrate NodeMailer
    var mailOptions = {
        from: process.env.EMAIL,
        to: req.body.senderEmail,
        subject: req.body.subject,
        html: req.body.html,
    };
    let info = transport.sendMail(mailOptions);
    const email = new Emails(req.body);
    const createUser = await email.save();
    console.log(createUser);
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
    const emailData = await Emails.find();
    for (let i = 0; i < emailData.length; i++) {
      const ele = emailData[i];
      if (ele.email == req.body.email) {
          emails.push(ele);
        }
    }
    res.status(201).send({
      emails,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/gmail/login", async (req, res) => {
  try {
    let user = {};
    const userData = await Users.find();
    for (let i = 0; i < userData.length; i++) {
      const ele = userData[i];
      if (ele.email == req.body.email) {
        if (ele.pass == req.body.pass) {
          user = ele;
          res.status(200).send({
            message: "User login success",
            user: ele,
          });
        }
      }
    }
    if (!user) {
      res.status(400).send("Email or password incorrect.");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;