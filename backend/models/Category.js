const mongoose = require("mongoose");

//Category Model Schema
const CategorySchema = new mongoose.Schema(
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CategorySchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});
module.exports = mongoose.model("Category", CategorySchema);
