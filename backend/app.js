
//brings in express and cors middleware
const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/errorHandler");
const cookie = require("cookie-parser");
const path = require("path");

// File uploading
app.use(fileUpload());

//sets up path to public folder
app.use(express.static(path.join(__dirname, "public")));

//brings in cors middleware
app.use(express.json());
app.use(cors());

//cookie parser
app.use(cookie());

const auth = require("./routes/auth");
const uploads = require("./routes/uploads");
const products = require("./routes/product");
const ratings = require("./routes/ratings");
const chats = require("./routes/chat");
const adminAuth = require("./routes/admin/auth");
const adminCategory = require("./routes/admin/category");
const adminBrands = require("./routes/admin/brand");
const adminUsers = require("./routes/admin/user");
const adminProducts = require("./routes/admin/product");

//All user routes
// api/v1 used as route for backwards compatibility design
app.use("/api/v1/auth", auth);
app.use("/api/v1/uploads", uploads);
app.use("/api/v1/products", products);
app.use("/api/v1/chats", chats);
app.use("/api/v1/ratings", ratings);

//All admin routes
app.use("/api/v1/admin/auth", adminAuth);
app.use("/api/v1/admin/categories", adminCategory);
app.use("/api/v1/admin/brands", adminBrands);
app.use("/api/v1/admin/users", adminUsers);
app.use("/api/v1/admin/products", adminProducts);

app.use(errorHandler);

module.exports = app;
