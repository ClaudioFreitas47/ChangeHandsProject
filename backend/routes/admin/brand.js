//brings in express
const express = require("express");

//brings in controller
const router = express.Router();
const {
  createBrand,
  updateBrand,
  getAllBrands,
  getSingleBrand,
  deleteBrand,
} = require("./../../controllers/admin/brand");

//brings in middlware
const { adminAuthentication } = require("../../middleware/adminAuthentication");

//API routes, with admin auth
router.post("/createBrand", createBrand);
router.post("/deleteBrand", adminAuthentication, deleteBrand);
router.post("/updateBrand", adminAuthentication, updateBrand);
router.get("/getAllBrands", adminAuthentication, getAllBrands);
router.get("/getSingleBrand", adminAuthentication, getSingleBrand);

module.exports = router;
