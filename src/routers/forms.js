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
    let user = {};
    const userData = await Forms.find();
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