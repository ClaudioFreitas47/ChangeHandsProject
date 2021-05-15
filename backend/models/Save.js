const mongoose = require("mongoose");

//Save Post Model Schema
const SaveSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      default: 0,
    },
    //sets the reference as the product id
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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

//exports mongo module
module.exports = mongoose.model("Save", SaveSchema);
