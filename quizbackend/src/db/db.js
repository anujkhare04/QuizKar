const mongoose = require("mongoose");

const connectDb = async() => {
  try {
    
    const connectedDb=await mongoose.connect(process.env.MONGODB_URI)
    console.log(`mongoose at connected ${connectedDb.connection.host}`);
    
  } catch (error) {
    console.log(`mongoDb connected at ${error}`);
    process.exit(1);

  }
};

module.exports=connectDb