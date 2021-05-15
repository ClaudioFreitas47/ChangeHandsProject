const ErrorHandler = require("../handlers/errorHandler");
const errorHandler = (err, req, res, next) => {

  //Database Error
  let error = { ...err };
  error.message = err.message;
  if (err.name === "CastError") {
//database item not found
    const message = `This Has Not Been Found`;
//returns new error message, with status 404
    error = new ErrorHandler(message, 404);
  }

  //(User already exists) wrong syntax mongodb code
  if (err.code === 11000) {
    let messageText = "";
    messageText = "Syntax Error/Duplicate Index";
    const message = messageText;
    //returns error message with status 400
    error = new ErrorHandler(message, 400);
  }
  
  //Input Field Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    //returns error message with statud 400
    error = new ErrorHandler(message, 400);
  }
  //returns server error with status 500
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};
//exports error handlers
module.exports = errorHandler;
