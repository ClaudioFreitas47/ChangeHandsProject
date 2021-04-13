const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");
const Admin = require("../models/Admin");
const { SECRET } = require("../configuration/jwt");

//export used in routes to authenticate admin
exports.adminAuthentication = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
 
  //Returns error message if user is not authenticated
  if (!token) {
    return next(new ErrorHandler("Authentiation Required to Access This Route!", 401));
  }

 //Verifys the token and responds with 401 error
  try {
    const deciphered = jwt.verify(token, SECRET);

    const admin = await Admin.findById(deciphered.id);
    if (!admin) {
      return next(
        new ErrorHandler("Authentiation Required to Access This Route!", 401)
      );
    }
    req.admin = admin;
    next();
  } catch (error) {
    return next(new ErrorHandler("Authentiation Required to Access This Route!", 401));
  }
});
