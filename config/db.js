const mongoose = require("mongoose");
require("dotenv").config();
const url = "mongodb://localhost:27017/db";
const connection = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};


module.exports =connection