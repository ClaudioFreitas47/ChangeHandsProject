const ErrorHandler = require("../handlers/errorHandler");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const User = require("./../models/User");


//private upload
exports.privateUploads = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorHandler(`Please upload a file`, 400));
  }

  const file = req.files.privateUpload;
  if (!file) {
    return next(new ErrorHandler(`Please upload a file`, 400));
  }
  // Make sure the image is a photo
  // Check file size
  if (!file.mimetype.startsWith("image")) {
    if (file.size > 1000000) {
      return next(
        new ErrorHandler(`Please upload an image less than 1MB`, 400)
      );
    }
  } else if (!file.mimetype.startsWith("video")) {
    if (file.size > 50000000) {
      return next(
        new ErrorHandler(`Please upload an image less than 50MB`, 400)
      );
    }
  }
  const timeNow = Date.now();
  console.log(timeNow);
  file.name = `file-${Math.random(1, 100000)}-${timeNow}-uploads-${Math.random(
    1,
    100000
  )}${path.parse(file.name).ext}`;

  file.mv(`./public/uploads/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorHandler(`Problem with file upload`, 500));
    }
    const id = req.user.id;
    await User.findByIdAndUpdate(id, {
      profile: file.name,
    });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});


//public upload
exports.publicUploads = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorHandler(`Please upload a file`, 400));
  }

  const file = req.files.publicUpload;
  if (!file) {
    return next(new ErrorHandler(`Please upload a file`, 400));
  }
  // Make sure the image is a photo
  // Check filesize
  if (!file.mimetype.startsWith("image")) {
    if (file.size > 1000000) {
      return next(
        new ErrorHandler(`Please upload an image less than 1MB`, 400)
      );
    }
  } else if (!file.mimetype.startsWith("video")) {
    if (file.size > 50000000) {
      return next(
        new ErrorHandler(`Please upload an image less than 50MB`, 400)
      );
    }
  }
  const timeNow = Date.now();
  console.log(timeNow);
  file.name = `file-${Math.random(1, 100000)}-${timeNow}-uploads-${Math.random(
    1,
    100000
  )}${path.parse(file.name).ext}`;

  file.mv(`./public/uploads/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorHandler(`Problem with file upload`, 500));
    }

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
