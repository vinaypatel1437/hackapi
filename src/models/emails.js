const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  html: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  }
});

const Emails = new mongoose.model("Emails", userSchema);

module.exports = Emails;