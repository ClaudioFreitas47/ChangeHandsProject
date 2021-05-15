//error handler for all errors. Provides status code and message
class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  //exports error handler for use in app
  module.exports = ErrorHandler;
  