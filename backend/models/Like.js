const mongoose = require("mongoose");

//Like Model Schema
const LikeSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      default: 0,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Like", LikeSchema);
