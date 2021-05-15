const ErrorHandler = require("../../handlers/errorHandler");
const asyncHandler = require("../../middleware/asyncHandler");
const Product = require("../../models/Product");

//updates the product

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, image, price, id } = req.body;

  //finds the product based on the ID
  const found = Product.findOne({
    _id: id,
  });
  //if no product is found matching the ID an error is presented
  if (!found) {
    return next(new ErrorHandler("No Product Was Found", 404));
  }

  //updates the product and returns success message
  const product = await Product.findByIdAndUpdate(id, {
    name,
    description,
    price,
    image,
  });
  
  //returns success status
  return res.status(200).json({
    success: true,
    data: product,
  });
});


//deletes the product by id

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  const found = Product.findOne({
    _id: id,
  });
  //returns error message
  if (!found) {
    return next(new ErrorHandler("No Product Was Found", 404));
  }

  //finds product by its id and deletes it
  await Product.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    data: {},
  });
});

//gets all the user products
exports.getAllProducts = asyncHandler(async (req, res, next) => {

  //populates the data with the user and category information
  const products = await Product.find({})
    .populate({
      path: "createdBy",
    })
    .populate({
      path: "category",
    });

    //returns success message

  return res.status(200).json({
    success: true,
    data: products,
  });
});


//gets one product from the query
exports.getSingleProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.query;

  //if the productID doesnt exist an error message is provided
  if (!productId) {
    new ErrorHandler("No ProductId Provided", 400);
  }
  //returns error message
  const product = await Product.findById({ _id: productId });
  if (!product) {
    return next(
      new ErrorHandler(
        `No Product Matching: ${productId} Has Been Found!`,
        404
      )
    );
  }
  //returns success message
  return res.status(200).json({
    success: true,
    data: product,
  });
});
