const express = require("express");
const router = new express.Router();
const cors = require("cors");
const Forms = require("../models/forms");
const Form = require("../models/form");

router.post("/forms/signin", async (req, res) => {
  try {
    const user = new Forms(req.body);
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


router.post("/forms/senddata", async (req, res) => {
    try {
      {
        var users = await Form.find({
          email: req.body.formId,
        });
        //users = JSON.parse(users);
        if (!users.length || users === {}) {
          var user = new Form({
            email: req.body.formId,
            data: JSON.stringify([req.body.data])
          });
          var createUser = await user.save();
          console.log(createUser);
        } else {
          console.log(users[0].email, "Message");
          const messages = [...JSON.parse(users[0].data), JSON.stringify(req.body.data)];
          await Form.updateOne(
            { email: req.body.formId},
            {
              $set: {
                data: JSON.stringify(messages),
              },
            }
          );
        }
        res.status(201).send({
          message: 'Email sent successfully',
          success: createUser,
        });
      }
      } catch (e) {
        console.log(e);
        res.status(400).send(e);
      }
});

router.post("/forms/getalldata", async (req, res) => {
    try {
        let user = {};
        const userData = await Form.find({email: req.body.formId});
        if (!userData || userData.length === 0) {
          res.status(400).send("User data is not available");
        }
        res.status(200).send({
          message: "User login success",
          user: userData[0],
        });

      } catch (e) {
        console.log(e);
        res.status(400).send(e);
      }
});

router.post("/forms/login", async (req, res) => {
  try {
    const userData = await Forms.find({email : req.body.email});
    if (userData.length === 0 || !userData) {
      res.status(400).send({ message: "Email incorrect"});
    }
  else if(userData[0].pass===req.body.pass) {
        res.status(200).send({
        user: userData[0],
        message: "User login success"
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
