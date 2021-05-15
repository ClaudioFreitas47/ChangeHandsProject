const express = require("express");
const router = express.Router();

//brings in controller
const {
  registerUser,
  login,
  getUser,
  updatePassword,
  updateProfile,
  getProfileDetails,
} = require("../controllers/userAuth");

//brings in middleware
const { userAuthentication } = require("../middleware/userAuthentication");

//routes for API, "userAuthentication" protects the route
router.post("/register", registerUser);
router.post("/login", login);
router.post("/updatePassword", userAuthentication, updatePassword);
router.post("/updateProfile", userAuthentication, updateProfile);

//get for user and profile details.
router.get("/user", userAuthentication, getUser);
router.get("/getProfileDetails", userAuthentication, getProfileDetails);

module.exports = router;
