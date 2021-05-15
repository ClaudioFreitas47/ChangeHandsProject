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
        //sets mongoose virtuals to true, used to access in code
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
    //sets the category schema virtual to posts
CategorySchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});
module.exports = mongoose.model("Category", CategorySchema);
