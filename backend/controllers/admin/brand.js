const Brand = require("../../models/Brand");
const Product = require("../../models/Product");
const asyncHandler = require("../../middleware/asyncHandler");


//creates the brand and returns success message
exports.createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const brand = await Brand.create({
    name,
  });
  return res.status(200).json({
    success: true,
    data: brand,
  });
});

//gets all the brands and returns success message
exports.getAllBrands = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find({});
  return res.status(200).json({
    success: true,
    data: brands,
  });
});

//gets a single brand based on a query and returns a success messgae
exports.getSingleBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.query.id);
  return res.status(200).json({
    success: true,
    data: brand,
  });
});

//updates the brand by the ID and returns success message
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { name, id } = req.body;

  await Brand.findByIdAndUpdate(id, {
    name,
  });
  return res.status(200).json({
    success: true,
    message: "Brand Has Been Updated",
  });
});

//deletes the brand by the id and returns the success message
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  await Brand.findByIdAndDelete(id);
  //removes the brand from all the products
  await Product.deleteMany({
    brand: id,
  });

  //returns message of removed brand
  return res.status(200).json({
    success: true,
    message: "Brand Has Been Deleted",
  });
});
