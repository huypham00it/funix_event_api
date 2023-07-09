const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
  // role: {
  //   type: mongoose.Types.ObjectId,
  //   ref: 'Role',
  //   required: true
  // },
  // event: [{
  //   type: mongoose.Types.ObjectId,
  //   ref: 'English Event'
  // }],
  // accessToken: {
  //   type: String
  // }
});

module.exports = mongoose.model("user", userSchema);