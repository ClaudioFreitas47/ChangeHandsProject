//brings in express
const express = require("express");
const router = express.Router();

//brings in controller
const {
    sendMessage, 
    getAllChats, 
    getUserChat,
}   = require("../controllers/chat");

const { userAuthentication } = require("../middleware/userAuthentication");

//API routes with user AUTH
router.post("/sendMessage", userAuthentication, sendMessage);
router.get("/getAllChats", userAuthentication, getAllChats);
router.get("/getUserChat", userAuthentication, getUserChat);

module.exports = router;
