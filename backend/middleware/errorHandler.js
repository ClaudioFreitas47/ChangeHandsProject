const ErrorHandler = require("../handlers/errorHandler");
const errorHandler = (err, req, res, next) => {

  //Database Error
  let error = { ...err };
  error.message = err.message;
  if (err.name === "CastError") {

    const message = `This Has Not Been Found`;

    error = new ErrorHandler(message, 404);
  }

  //(User already exists) wrong syntax mongodb code
  if (err.code === 11000) {
    let messageText = "";
    messageText = "Syntax Error/Duplicate Index";
    const message = messageText;
    error = new ErrorHandler(message, 400);
  }
  
  //Input Field Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorHandler(message, 400);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};
module.exports = errorHandler;
