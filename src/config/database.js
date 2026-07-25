const mongoose = require("mongoose");
const clc = require("cli-color");
const config = require("../config/config")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI);
    console.log(clc.green.underline("Database connected successfully:") + clc.yellow.underline(`DB_Name ${conn.connection.name}`), '+', clc.yellow.underline(`Host ${conn.connection.host}`));
    // console.log(`MongoDB Connected: ${clc.green.underline(conn.connection.host)}`);
    mongoose.set(
      "debug", true)
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;