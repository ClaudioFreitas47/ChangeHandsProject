const ErrorHandler = require("../../handlers/errorHandler");
const Admin = require("../../models/Admin");
const asyncHandler = require("../../middleware/asyncHandler");
const bcrypt = require("bcryptjs");
//const { COOKIE_EXPIRATION } = require("../../configuration/jwt");

//registers the admin account

exports.registerAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //creates the admin account using email and password
  const admin = await Admin.create({
    email,
    password,
  });
  //send the admin token
  sendTokenResponse(admin, 200, res);
});

//login the admin account with the email and password
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //Validation for the admin email and password

  if (!email || !password) {
    return next(new ErrorHandler("Email and Password Not Provided!", 400));
  }
 
  //finds the admin account with the updated password
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    return next(new ErrorHandler("Email And Password Do Not Match", 401));
  }

  //Checks the DB to see if the passwords match
  const matchPass = await admin.matchPassword(password);
  if (!matchPass) {
    return next(new ErrorHandler("Email And Password Do Not Match", 401));
  }

  //sends the auth token

  sendTokenResponse(admin, 200, res);
});
//creates a cookie from the token (same process for all users)
const sendTokenResponse = (admin, statusCode, res) => {
  const token = admin.getSignedJwtToken();
 
  //cookies expire in 24 hours and is only for the client side
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  //returns success message
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//updates the password to the new password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { password, newPassword } = req.body;
  const id = req.admin.id;
  const email = req.admin.email;
  
  //validates the new password
  if (!password || !newPassword) {
    return next(new ErrorHandler("Please Provide A Valid Password", 400));
  }
 
  //checks for the new password
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    return next(new ErrorHandler("Email And Password Do Not Match", 401));
  }

  //check if new password matches
  const matchPass = await admin.matchPassword(password);
  if (!matchPass) {
    return next(new ErrorHandler("Please Provide A Valid Password", 401));
  }
  //uses salt and bcrypt to encrypt the password before sending to DB

  const salt = await bcrypt.genSalt(10);
  const updatedPassword = await bcrypt.hash(newPassword, salt);
  //updates the admin account with the new password
  const updatedAdmin = await Admin.findOneAndUpdate(
    {
      _id: id,
    },
    {
      password: updatedPassword,
    }
  );
  return res.status(200).json({
    success: true,
    message: "Password Has Been Updated",
  });
});
