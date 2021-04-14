const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  getUser,
  updatePassword,
  updateProfile,
  getProfileDetails,
} = require("../controllers/userAuth");

const { userAuthentication } = require("../middleware/userAuthentication");

router.post("/register", registerUser);
router.post("/login", login);
router.post("/updatePassword", userAuthentication, updatePassword);
router.post("/updateProfile", userAuthentication, updateProfile);

router.get("/user", userAuthentication, getUser);
router.get("/getProfileDetails", userAuthentication, getProfileDetails);

module.exports = router;
