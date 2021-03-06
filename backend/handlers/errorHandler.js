//error handler for all errors. Provides status code and message
//needed to prevent bad inputs from crashing server
class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  //exports error handler for use in app
  module.exports = ErrorHandler;
  