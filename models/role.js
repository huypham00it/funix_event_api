const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // desc: {
  //   type: String,
  //   required: true,
  // },
  permission: {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model("role", roleSchema);