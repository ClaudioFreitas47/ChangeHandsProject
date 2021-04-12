const mongoose = require("mongoose");

//Message Model Schema
const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    default: null,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = MessageSchema;
