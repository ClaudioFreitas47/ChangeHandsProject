//brings in express
const express = require("express");
const router = express.Router();

//brings in controller
const { addRating } = require("../controllers/rating");
const { userAuthentication } = require("../middleware/userAuthentication");

//brings in API route with auth
router.post("/addRating", userAuthentication, addRating);

module.exports = router;
