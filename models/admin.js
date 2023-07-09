const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  accessToken: {
    type: String
  }
});

module.exports = mongoose.model("admin", adminSchema);