const mongoose = require("mongoose");

//rating model schema
const RatingSchema = new mongoose.Schema(
  {
    rate: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ratingFrom: {
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
//exports rating module
module.exports = mongoose.model("Rating", RatingSchema);
