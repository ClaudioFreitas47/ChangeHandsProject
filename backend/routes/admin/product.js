//brings in express
const express = require("express");
const router = express.Router();

//brings in controllers
const {
  updateProduct,
  getAllProducts,
  deleteProduct,
  getSingleProduct,
} = require("./../../controllers/admin/product");

//brings in admin auth
const { adminAuthentication } = require("../../middleware/adminAuthentication");

//API routes with admin auth
router.post("/updateProduct", adminAuthentication, updateProduct);
router.post("/deleteProduct", adminAuthentication, deleteProduct);
router.get("/getAllProducts", adminAuthentication, getAllProducts);
router.get("/getSingleProduct", adminAuthentication, getSingleProduct);

module.exports = router;
