const express = require("express");
const router = new express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const Users = require("../models/gmail");
const Emails = require("../models/emails");

// var transport = nodemailer.createTransport({
//     host: 'smtp.zoho.in',
//     port: 465,
//     secure: true, //ssl
//     auth: {
//         user:process.env.EMAIL,
//         pass:process.env.EMAIL_PASSWORD
//     }
// });


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
    // var mailOptions = {
    //     from: process.env.EMAIL,
    //     to: req.body.senderEmail,
    //     subject: req.body.subject,
    //     html: req.body.html,
    // };
    // let info = transport.sendMail(mailOptions);
    var users = await Emails.find({
      email: req.body.senderEmail,
    });
    //users = JSON.parse(users);
    if (!users.length || users === {}) {
      var user = new Emails({
        email: req.body.senderEmail,
        emailData: JSON.stringify([{
        subject: req.body.subject,
        html: req.body.html,
        email: req.body.email
      }]);
      var createUser = await user.save();
      console.log(createUser);
    } else {
      console.log(users[0].emailData, "Message");
      const messages = [...JSON.parse(users[0].emailData), JSON.stringify({
        subject: req.body.subject,
        html: req.body.html,
        email: req.body.email
      })];
      await Emails.updateOne(
        { email: req.body.senderEmail},
        {
          $set: {
            emailData: JSON.stringify(messages),
          },
        }
      );
    }
    res.status(201).send({
      message: 'Email sent successfully',
      success: createUser,
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
    if (userData.length === 0 || !userData) {
      res.status(400).send({ message: "Email incorrect"});
    }
  else if(userData[0].pass===req.body.pass) {
        res.status(200).send({
        user: userData[0],
        message: "Success"
        });
    }
    else {
        res.status(400).send({message: 'Password incorrect'});
    }
    console.log(userData)
    
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
