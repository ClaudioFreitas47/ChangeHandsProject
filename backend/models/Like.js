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
   //sets mongoose virtuals to true, used to access in code
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//exports like model
module.exports = mongoose.model("Like", LikeSchema);
