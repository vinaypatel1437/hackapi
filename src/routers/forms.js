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
        const user = new Form(req.body);
        const createUser = await user.save();
        console.log(createUser);
        res.status(201).send({
          formData: createUser,
        });
      } catch (e) {
        console.log(e);
        res.status(400).send(e);
      }
});

router.post("/forms/getalldata", async (req, res) => {
    try {
        let user = {};
        const userData = await Form.find();
        for (let i = 0; i < userData.length; i++) {
          const ele = userData[i];
          if (ele.formId == req.body.formId) {
              user = ele;
              res.status(200).send({
                message: "User login success",
                user: ele,
              });
          }
        }
        if (!user) {
          res.status(400).send("Email or password incorrect.");
        }
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
