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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Product", ProductSchema);
