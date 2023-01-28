const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true,
  },
  emailData: {
    type: String,
    required: true,
  }
});

const Emails = new mongoose.model("Emails", userSchema);

module.exports = Emails;
