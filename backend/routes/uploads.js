//brings in express
const express = require("express");
const router = express.Router();

//brings in controller and auth middleware
const { privateUploads, publicUploads } = require("../controllers/uploads");

const { userAuthentication } = require("../middleware/userAuthentication");

//API routes with AUTH
router.post("/privateUploads", userAuthentication, privateUploads);
router.post("/publicUploads", publicUploads);

module.exports = router;
