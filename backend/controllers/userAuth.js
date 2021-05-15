const ErrorHandler = require("../handlers/errorHandler");
const User = require("../models/User");
const Rating = require("../models/Rating");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

//bcrypt encrypts password
const bcrypt = require("bcryptjs");

//registers the user
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, username, email, password, profile } = req.body;
  //Creates a new user
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    profile,
  });
  //gets the users authentication token
  sendTokenResponse(user, 200, res);
});


//logs in the user
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  //If statement to validate the users
  if (!username || !password) {
    return next(new ErrorHandler("Please Provide a Valid Username and Password", 400));
  }
  //Finds the user and selects the newest password
  const user = await User.findOne({ username }).select("+password");
  //if the user cannot be authenticated an error is shown
  if (!user) {
    return next(new ErrorHandler("Please Enter A Valid Username and Password", 401));
  }

  //If the password doesnt match, an error is presented
  const matchPass = await user.matchPassword(password);
  if (!matchPass) {
    return next(new ErrorHandler("Please Enter A Valid Username and Password", 401));
  }
//sends the auth token
  sendTokenResponse(user, 200, res);
});

//sends token to create a cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  
  //cookie works on the client side
  //cookie expires in 24 hours from the creation data
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
     //http only prevents client-side scripts from accessing cookies
    httpOnly: true,
  };

  //returns success message
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};


//gets the users account
exports.getUser = asyncHandler(async (req, res, next) => {
  //finds user by ID and returns success message
  try {
    const user = await User.findById(req.user.id);
    console.log("user", user);
    res.status(200).json({
      success: true,
      data: user,
    });
    //returns error in console log
  } catch (error) {
    console.log("error", error);
  }
});

//updates the users profile
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    contactNum,
    social,
    birthDate,
    gender,
    aboutMe,
//saves variables in the body
  } = req.body;
  const id = req.user.id;
  //finds user by ID and updates new information
  await User.findByIdAndUpdate(id, {
    firstName,
    lastName,
    contactNum,
    social,
    birthDate,
    gender,
    aboutMe,
  });

  //returns success message
  res.status(200).json({
    success: true,
    messsage: "Profile Has Been Updated",
  });
});

//updates the users password with a new one
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { password, newPassword } = req.body;
  const id = req.user.id;
  const username = req.user.username;
  //Validate email and password
  if (!password || !newPassword) {
    return next(new ErrorHandler("Please Provide A Valid Password", 400));
  }
  
 //if password doesnt match username, returns error message
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Incorrect Username Or Password", 401));
  }

  //check if password matches
  const matchPass = await user.matchPassword(password);
  //returns error if pass doesnt match
  if (!matchPass) {
    return next(new ErrorHandler("Wrong Password Has Been Provided", 401));
  }

  //Generates a salt to encrypt the password 
  const SALT = await bcrypt.genSalt(10);
  //encrypts password with SALT
  const updatedPassword = await bcrypt.hash(newPassword, SALT);

  //updates the user with the new password
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      password: updatedPassword,
    }
  );

  //returns success status and message
  return res.status(200).json({
    success: true,
    message: "Password Has Been Updated",
  });
});

//Gets the users profile details 
exports.getProfileDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.query.username });
//returns error if user profile hasnt been found
  if (!user) {
    return next(new ErrorHandler("No User Has Been Found", 404));
  }

  //cheeks if the ratings exists
  let ratingExists = true;
  //finds products by user ID
  const products = await Product.find({ createdBy: user._id });
  //finds ratings by user id
  const ratingsAdded = await Rating.findOne({
    user: user._id,
    ratingFrom: req.user._id,
  });
  const ratings = await Rating.find({
    user: user._id,
  });

  //if the ratings exist it turns to true, else it returns false
  if (ratingsAdded) {

    ratingExists = true;

  } else {

    ratingExists = false;
  }
  //responds with the data
  res.status(200).json({
    success: true,
    data: user,
    products: products,
    ratingExists,
    ratings,
  });
});
