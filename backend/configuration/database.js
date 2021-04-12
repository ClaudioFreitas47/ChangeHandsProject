//brings in mongoose
const mongoose = require("mongoose");

//connects the DB to local db
const mongoDBConnection = async () => {
  try {
    const connectionDB = await mongoose.connect(
      "mongodb://localhost/changehands",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
//console logs the connection
    console.log("MongoDB has been connected");
  } catch (error) {
    console.log(error);
  }
};
//exports DB connection
module.exports = mongoDBConnection;
