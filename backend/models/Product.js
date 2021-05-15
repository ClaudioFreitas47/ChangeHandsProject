const mongoose = require("mongoose");

//Product Model Schema
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      //sets the max length of the description
      maxlength: [1000, "Max Description Length Is 1000 Characters"],
    },
    image: {
      type: String,
      default: null,
    },

    price: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: "M",
    },
    condition: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      default: 0,
    },
    //sets the createdby to the user ID
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Select A Category"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Select A Brand"],
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

//exports product module
module.exports = mongoose.model("Product", ProductSchema);
