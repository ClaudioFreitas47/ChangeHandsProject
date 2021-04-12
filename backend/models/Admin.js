//brings in module, encryption for passwords
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { EXPIRATION, SECRET } = require("../configuration/jwt");

//Admin Model Schema
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Email must contain '@' and a valid domain",
    ],
  },
  password: {
    type: String,
    required: true,
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      `Password must contain the following:
      Uppercase and lowercase characters, 
      Any digit character (0-9)
      Atleast 8 characters in length.`,
    ],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//Admin password is encrypted then saved in the DB
//same process as user accounts
AdminSchema.pre("save", async function (next) {
  const SALT = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, SALT);
  next();
});

AdminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: "admin" }, SECRET, {
    expiresIn: EXPIRATION,
  });
};

//Matchs the passwords entered
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
