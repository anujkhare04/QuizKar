const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quizapp";

  try {
    console.log("Mongo URI:", mongoUri);

    const connectedDb = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`\nSUCCESSFULLY CONNECTED to MongoDB: ${connectedDb.connection.host}\n`);
    return connectedDb;
  } catch (error) {
    console.error("\nMONGODB CONNECTION FAILED:");
    console.error(`Error Name: ${error.name}`);
    console.error(`Error Message: ${error.message}`);

    if (error.name === "MongooseServerSelectionError") {
      console.error("Hint: Ensure MongoDB is running or update MONGODB_URI in quizbackend/.env");
    }

    throw error;
  }
};

module.exports = connectDb;
