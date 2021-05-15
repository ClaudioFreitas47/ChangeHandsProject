const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const Product = require("../../models/Product");
const asyncHandler = require("../../middleware/asyncHandler");


//creates the product category
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.create({
    name,
  });
  //returns success message
  return res.status(200).json({
    success: true,
    data: category,
  });
});

//gets all the categories and returns success message
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});
  const brands = await Brand.find({});

  //returns success status
  return res.status(200).json({
    success: true,
    data: categories,
    brands: brands,
  });
});

//updates the category
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { name, id } = req.body;

  //finds the category by the ID and update it and return success message
  await Category.findByIdAndUpdate(id, {
    name,
  });

  //returns success status and message
  return res.status(200).json({
    success: true,
    message: "Category Has Been Updated ",
  });
});

//deletes the category
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  //finds the category by the ID and deletes it.
  //also deletes the category from every product
  await Category.findByIdAndDelete(id);
  await Product.deleteMany({
    category: id,
  });
  //returns success messaged
  return res.status(200).json({
    success: true,
    message: "Category Has Been Deleted",
  });
});

//gets a single category and returns a success message
exports.getSingleCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.query.id);
  return res.status(200).json({
    success: true,
    data: category,
  });
});
