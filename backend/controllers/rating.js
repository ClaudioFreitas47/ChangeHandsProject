const ErrorHandler = require("../handlers/errorHandler");
const Rating = require("../models/Rating");
const asyncHandler = require("../middleware/asyncHandler");

//Checks which user is rating and returns error if user is trying to rate themselves
exports.addRating = asyncHandler(async (req, res, next) => {
  const { user, rate } = req.body;
  const ratingFrom = req.user.id;
  if (ratingFrom === user) {
    return next(new ErrorHandler("You Can Not Rate Yourself!", 400));
  }

  const ratingExists = await Rating.findOne({
    user,
    ratingFrom,
  });

  //Checks if user is rated already then returns an error
  if (ratingExists) {
    return next(
      new ErrorHandler("You Have Already Rated This User!", 400)
    );
  }
  //creates the new rating
  const rating = await Rating.create({
    user,
    ratingFrom,
    rate,
  });
  
  //returns success message
  return res.status(200).json({
    success: true,
    message: "This User Has Been Succesfully Rated.",
  });
});
