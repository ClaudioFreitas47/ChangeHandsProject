//brings in expres
const express = require("express");
const router = express.Router();

//brings in controllers
const {
  createCategory,
  getAllCategories,
  getSingleCategory,
  deleteCategory,
  updateCategory,
} = require("./../../controllers/admin/category");

const { adminAuthentication } = require("../../middleware/adminAuthentication");

//brings in API routes with admin Auth
router.post("/createCategory", adminAuthentication, createCategory);
router.post("/deleteCategory", adminAuthentication, deleteCategory);
router.post("/updateCategory", adminAuthentication, updateCategory);
router.get("/getAllCategories", adminAuthentication, getAllCategories);
router.get("/getSingleCategory", adminAuthentication, getSingleCategory);

module.exports = router;
