const ErrorHandler = require("../handlers/errorHandler");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const User = require("./../models/User");


//private upload
exports.privateUploads = asyncHandler(async (req, res, next) => {
  //if there is no file uploaded it returns an error message
  if (!req.files) {
    return next(new ErrorHandler(`Please upload a file`, 400));
  }

  const file = req.files.privateUpload;
  //if the file isnt uploaded it returns an error message
  if (!file) {
    return next(new ErrorHandler(`Please upload a file`, 400));
  }
  // Make sure the file is an image
  // Check file size and makes sure its less than 10MB
  if (!file.mimetype.startsWith("image")) {
    if (file.size > 10000000) {
      //returns error message
      return next(
        new ErrorHandler(`Please upload an image less than 10MB`, 400)
      );
    }
    //if the file is a video it makes sure its less than 50MB
  } else if (!file.mimetype.startsWith("video")) {
    if (file.size > 50000000) {
      //returns error message
      return next(
        new ErrorHandler(`Please upload a video less than 50MB`, 400)
      );
    }
  }
  //creates a variable of the current date
  const timeNow = Date.now();
// creates a random file name, this prevents user names from entering the system
  file.name = `file-${Math.random(1, 100000)}-${timeNow}-uploads-${Math.random(
    1,
    100000
  )}${path.parse(file.name).ext}`;

  //returns error if there was any problems uploading the file
  file.mv(`./public/uploads/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorHandler(`Problem with file upload`, 500));
    }
    //finds the user by id and upfates the profile picture with the new image
    const id = req.user.id;
    await User.findByIdAndUpdate(id, {
      profile: file.name,
    });

    //returns success status
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});


//public uploads of files, used for product images
exports.publicUploads = asyncHandler(async (req, res, next) => {
  //if no file exists an error appears
  if (!req.files) {
    return next(new ErrorHandler(`Please upload a file`, 400));
  }

  //creates variable of the file upload
  const file = req.files.publicUpload;
  if (!file) {
    return next(new ErrorHandler(`Please upload a file`, 400));
  }
 
  // Check filesize and makes sure its an image
  if (!file.mimetype.startsWith("image")) {
    if (file.size > 10000000) {
      //returns error message
      return next(
        new ErrorHandler(`Please upload an image less than 10MB`, 400)
      );
    }
    //checks if file is a video and makes sure its less than 50MB
  } else if (!file.mimetype.startsWith("video")) {
    if (file.size > 50000000) {
      //returns error messgae
      return next(
        new ErrorHandler(`Please upload an video less than 50MB`, 400)
      );
    }
  }
  //creates a variable for the current data
  const timeNow = Date.now();
//creates a random file name
  file.name = `file-${Math.random(1, 100000)}-${timeNow}-uploads-${Math.random(
    1,
    100000
  )}${path.parse(file.name).ext}`;

//returns error if any errors occurr when uploading file
  file.mv(`./public/uploads/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorHandler(`Problem with file upload`, 500));
    }
//returns success message
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
