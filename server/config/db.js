const mongoose = require("mongoose");

// Connect to MongoDB using the connection string from environment variables.
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully.");
};

module.exports = connectDB;
