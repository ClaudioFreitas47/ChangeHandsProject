//brings in bcrypt and JWT for encyrption and token auth
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { EXPIRATION, SECRET } = require("../configuration/jwt");
const UserSchema = new mongoose.Schema(
  
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        //sets the email regex 
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Email must contain '@' and a valid domain",
      ],
    },
    profile: {
      type: String,
      default: null,
    },
    contactNum: {
      type: String,
      default: null,
    },
    social: {
      type: String,
      default: null,
    },
    birthDate: {
      type: Date,
      default: null,
    },
    //Boolean, true for male, false for female
    gender: {
      type: Boolean,
      default: true,
    },
    aboutMe: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Please Add a password"],
      //sets the password Regex
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
  },
  {
        //sets mongoose virtuals to true, used to access in code
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//Encrypts the password and saves it in the DB
UserSchema.pre("save", async function (next) {
  const SALT = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, SALT);
  next();
});

//Signs JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, SECRET, {
    expiresIn: EXPIRATION,
  });
};

//Matches the passwords entered
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// creates virtual property for the chat and posts for the users
UserSchema.virtual("chats", {
  ref: "Chat",
  localField: "_id",
  foreignField: "receiver",
  justOne: false,
});

UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "receiver",
  justOne: false,
});

//exports module
module.exports = mongoose.model("User", UserSchema);
