const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const englishEventSchema = new Schema({
  heading: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mentor_info: {
    type: Map,
    required: true,
  },
  event_info: {
    type: Map,
    required: true,
  },
  histories: {
    type: Array,
  },
  register: {
    type: Array,
    require: true
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model("english_event", englishEventSchema);