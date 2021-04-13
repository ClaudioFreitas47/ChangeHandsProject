const User = require("../../models/User");
const Product = require("../../models/Product");
const asyncHandler = require("../../middleware/asyncHandler");

//gets all the users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  //returns success result 
  return res.status(200).json({
    success: true,
    data: users,
  });
});

//deletes users
exports.deleteUser = asyncHandler(async (req, res, next) => {
  try {
    //finds and deletes the user
    await User.findByIdAndDelete(req.body.id);
    await Product.deleteMany({
      createdBy: req.body.id,
    });

    //returns success message
    return res.status(200).json({
      success: true,
      message: "User Has Been Deleted",
    });

    //returns error message if user could not be deleted
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An Error Has Been Encountered",
    });
  }
});
