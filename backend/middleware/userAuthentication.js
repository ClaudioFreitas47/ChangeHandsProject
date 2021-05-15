const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");
const User = require("../models/User");
const { SECRET } = require("../configuration/jwt");

//export used in routes to authenticate user
exports.userAuthentication = asyncHandler(async (req, res, next) => {

  //sets up auth headers
  let token;
  if (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //Returns error message and status code if user is not authenticated
  if (!token) {
    return next(new ErrorHandler("Authentiation Required To Access This Route!", 401));
  }

  //Verifys the token and responds with 401 error
  try {
    const deciphered = jwt.verify(token, SECRET);
//finds user by ID and token
    const user = await User.findById(deciphered.id);
    //if user is not found/authenticated returns error
    if (!user) {
      return next(
        new ErrorHandler("Authentiation Required To Access This Route!", 401)
      );
    } else {
      req.user = user;
      next();
    }
    //catchs error and returns error message
  } catch (error) {
    return next(new ErrorHandler("Authentiation Required To Access This Route!", 401));
  }
});
