const mongoose = require("mongoose");

//Brand Model Schema
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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

//exports brand model
module.exports = mongoose.model("Brand", BrandSchema);
