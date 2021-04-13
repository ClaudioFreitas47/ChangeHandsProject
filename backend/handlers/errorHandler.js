//error handler for all errors. Provides status code and message
class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  module.exports = ErrorHandler;
  