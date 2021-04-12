const mongoose = require("mongoose");
const Message = require("./Message");

//Chat Model Schema
const ChatSchema = new mongoose.Schema({
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
  lastMessageText: {
    type: String,
  },
  lastMessageTime: {
    type: Date,
  },
  messages: [Message],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Chat", ChatSchema);
