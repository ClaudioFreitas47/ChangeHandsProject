//brings in express
const express = require("express");
const router = express.Router();

//brings in controller
const { 
    login, 
    updatePassword,
    registerAdmin 
} = require("../../controllers/admin/adminAuth");

//brings in middleware
const { adminAuthentication } = require("../../middleware/adminAuthentication");

//routes for API, "adminAuth" protects the route

router.post("/updatePassword", adminAuthentication, updatePassword);
router.post("/login", login);
router.post("/registerAdmin", registerAdmin);

module.exports = router;
