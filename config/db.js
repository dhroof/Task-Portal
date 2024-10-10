const mongoose = require("mongoose");

// Connect to the MongoDB database
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.ATLAS_CONNECTION_STRING);
    console.log(
      "Database Connected: ",
      connect.connection.name,
      connect.connection.host
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
