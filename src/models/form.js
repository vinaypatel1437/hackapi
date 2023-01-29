const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  data: {
    type: String,
    required: true,
  }
});

const Form = new mongoose.model("Form", userSchema);

module.exports = Form;
