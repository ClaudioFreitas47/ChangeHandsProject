const ErrorHandler = require("../handlers/errorHandler");
const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Like = require("./../models/Like");
const Brand = require("./../models/Brand");
const Save = require("./../models/Save");
const Rating = require("./../models/Rating");

//Creating product and saves it in the body
exports.createProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    image,
    price,
    size,
    category,
    brand,
    condition,
  } = req.body;

  //creates a function of who created the product by user ID
  const createdBy = req.user.id;

  //creates the product with all the specified conditions
  const product = await Product.create({
    name,
    description,
    price,
    image,
    size,
    brand,
    category,
    createdBy,
    condition,
  });

  //returns success message
  return res.status(200).json({
    success: true,
    data: product,
  });
});

//updates the product
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    image,
    price,
    id,
    size,
    category,
    brand,
    condition,

    //populates the body with the product information
  } = req.body;
  const createdBy = req.user.id;
  const found = Product.findOne({
    _id: id,
    createdBy: createdBy,
  });
  //returns error message if product isnt found
  if (!found) {
    return next(
      new ErrorHandler(
        `No Product Found`,
        404
      )
    );
  }
//updates the edited product
  const product = await Product.findByIdAndUpdate(id, {
    name,
    description,
    price,
    image,
    category,
    size,
    category,
    brand,
    condition,

  });
  //returns success message
  return res.status(200).json({
    success: true,
    data: product,
  });
});

//deletes the product
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const createdBy = req.user.id;
  const found = await Product.findOne({
    _id: id,
    createdBy: createdBy,
  });

 //returns error message if product isnt found
 if (!found) {
  return next(
    new ErrorHandler(
      `No Product Has Been Found`,
      404
    )
  );
}
//finds product and removes it, catches any errors
  try {
    await found.remove();
  } catch (error) {
    console.log("error", error);
  }

  //returns success status
  return res.status(200).json({
    success: true,
    data: {},
  });
});

//advanced search for products
exports.getAdvanceSearchedProducts = asyncHandler(async (req, res, next) => {
  
  
  const reqQuery = { ...req.query };
  //used to sort price of tiems
  let price;
  const { sortPrice } = req.body;
  if (sortPrice == 1) {
    price = 1;
  } else if (sortPrice == -1) {
    price = -1;
  } else {
    price = null;
  }

  //sorts products by price
  const products = await Product.find(reqQuery)
    .sort({ price: price })
    .populate({
      path: "createdBy",
    })
    .populate({
      path: "category",
    });

    //returns success status
  return res.status(200).json({
    success: true,
    data: products,
  });
});


//gets all the products
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  const products = await Product.find(reqQuery)
    .populate({
      path: "createdBy",
    })
    .populate({
      path: "category",
    });

    //returns success status
  return res.status(200).json({
    success: true,
    data: products,
  });
});


//gets a product based on the productID
exports.getSingleProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.query;
  console.log(productId);

  //error if there is no product ID
  if (!productId) {
    new ErrorHandler(`No productID found`, 400);
  }

  const product = await Product.findById({ _id: productId })
    .populate({
      path: "createdBy",
    })
    .populate({
      path: "category",
    })
    .populate({
      path: "brand",
    });
    //returns error if the product isnt found
  if (!product) {
    return next(
      new ErrorHandler(
        `No Product Matching ${productId} Found.`,
        404
      )
    );
  }

  //find all likes and ratings assoicated with the product
  const likes = await Like.find({ product: productId });
  const ratings = await Rating.find({
    user: product.createdBy._id,
  });
  //returns a success message and all the data accociated with the product
  return res.status(200).json({
    success: true,
    data: product,
    likes,
    ratings,
  });
});

//gets all the users products
exports.getMyProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ createdBy: req.user.id });

  //returns success message and all product data
  res.status(200).json({
    success: true,
    data: products,
  });
});


//gets all the categories and brands accociated with the product
exports.allCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});
  const brands = await Brand.find({});

  //returns success message and catageories data
  res.status(200).json({
    success: true,
    data: categories,
    brands,
  });
});

//returns the product based on the userssearch
exports.searchProduct = asyncHandler(async (req, res, next) => {
  const { searchWord } = req.query;
  const products = await Product.find({
    name: { $regex: new RegExp(searchWord) },
  })
    .populate({
      path: "createdBy",
    })
    .populate({
      path: "category",
    });

    //returns success status
  return res.status(200).json({
    success: true,
    data: products,
  });
});


//checks if the like button is or isnt pressed and returns a result
exports.likeProduct = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const { product } = req.body;
  let message = "";
  const likeExists = await Like.findOne({
    product,
    user,
  });
  //if the like exists it deletes the like from the DB and shows a message
  if (likeExists) {
    await Like.findByIdAndDelete(likeExists._id);
    message = "Product Has Been Unliked";
    //if the like doesnt exist, it creates a like in the DB and shows a message
  } else {
    await Like.create({
      user,
      product,
    });
    message = "Product Has Been Liked";
  }

  //returns success status
  return res.status(200).json({
    success: true,
    message,
  });
});

//is the product is saved, its saved into the DB and shows a message
exports.saveProduct = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const { product } = req.body;
  let message = "";
  const saveExists = await Save.findOne({
    product,
    user,
  });
  //if the product is saved already it removes it
  if (saveExists) {
    await Save.findByIdAndDelete(saveExists._id);
    message = "Product Has Been Unsaved";
    //saves the product
  } else {
    await Save.create({
      user,
      product,
    });
    message = "Product Has Been Saved";
  }

  //returns success status
  return res.status(200).json({
    success: true,
    message,
  });
});

//gets all the users saved products
exports.mySavedProducts = asyncHandler(async (req, res, next) => {
  const user = req.user.id;
  const products = await Save.find({
    user,
  }).populate({
    path: "product",
  });

  //returns success status
  return res.status(200).json({
    success: true,
    data: products,
  });
});
