

const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); 
    
    

    console.log(
      `✅ MongoDB connected | DB: ${mongoose.connection.name}`
    );

  } catch (error) {
    console.log(`❌ MongoDB failed to connect: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;
