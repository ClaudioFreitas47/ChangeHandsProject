//brings in mongoose
const mongoose = require("mongoose");

//connects the DB to local db
//using Mongodb atlas for testing purposes, normally would use localhost db
const mongoDBConnection = async () => {
  try {
    const connectionDB = await mongoose.connect(
      //local host DB commented out for testing purposes
     // "mongodb://localhost/changehands",
     "mongodb+srv://claudio:freitas123@change-hands.rn5gg.mongodb.net/change-hands?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
//console logs the connection
    console.log("MongoDB has been connected");
    
    //catchs any errors and returns a console log
  } catch (error) {
    console.log(error);
  }
};
//exports DB connection
module.exports = mongoDBConnection;
