//brings in express
const express = require("express");
const router = express.Router();
//brings in controllers and middlware auth
const { getAllUsers, deleteUser } = require("./../../controllers/admin/users");
const { adminAuthentication } = require("../../middleware/adminAuthentication");

//api route with admin auth
router.post("/deleteUser", adminAuthentication, deleteUser);
router.get("/getAllUsers", adminAuthentication, getAllUsers);

module.exports = router;
