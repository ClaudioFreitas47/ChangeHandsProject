//async used to wait for promise resolution
//simplifies the promises used in the application
const asyncHandler = fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next);
  };
  
  module.exports = asyncHandler;