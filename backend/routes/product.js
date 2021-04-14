//brings in express
const express = require("express");
const router = express.Router();

//brings in controllers
const {
  createProduct,
  getMyProducts,
  getAllProducts,
  updateProduct,
  likeProduct,
  saveProduct,
  getSingleProduct,
  deleteProduct,
  allCategories,
  searchProduct,
  getAdvanceSearchedProducts,
  mySavedProducts,
} = require("../controllers/product");

//middleware auth
const { userAuthentication } = require("../middleware/userAuthentication");


//API Routes with user Auth

router.post("/deleteProduct", userAuthentication, deleteProduct);
router.post("/updateProduct", userAuthentication, updateProduct);
router.post("/createProduct", userAuthentication, createProduct);
router.post("/saveProduct", userAuthentication, saveProduct);
router.post("/createProduct", userAuthentication, createProduct);
router.post("/likeProduct", userAuthentication, likeProduct);
router.post("/getAdvanceSearchedProducts", getAdvanceSearchedProducts);
router.get("/getMyProducts", userAuthentication, getMyProducts);
router.get("/allCategories", allCategories);
router.get("/getAllProducts", getAllProducts);
router.get("/searchProduct", searchProduct);
router.get("/getSingleProduct", userAuthentication, getSingleProduct);
router.get("/mySavedProducts", userAuthentication, mySavedProducts);

module.exports = router;
