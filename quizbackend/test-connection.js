require('dotenv').config();
const mongoose = require("mongoose");

console.log("\n🔍 Testing MongoDB Connection...\n");
console.log("Connection String:", process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':***@'));

const connectDb = async() => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    };
    
    console.log("\n⏳ Attempting to connect...\n");
    const connectedDb = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`\n✅ SUCCESS! Mongoose connected to: ${connectedDb.connection.host}\n`);
    process.exit(0);
    
  } catch (error) {
    console.log("\n❌ FAILED! Full Error Details:\n");
    console.log("Error Name:", error.name);
    console.log("Error Message:", error.message);
    console.log("\nFull Error:", error);
    
    // Specific error diagnostics
    if (error.name === 'MongooseServerSelectionError') {
      console.log("\n🔍 DIAGNOSIS: Cannot connect to MongoDB servers");
      console.log("Possible causes:");
      console.log("1. Network/DNS issue (use mobile hotspot to test)");
      console.log("2. IP not whitelisted in MongoDB Atlas Network Access");
      console.log("3. MongoDB cluster is paused");
      console.log("4. Firewall blocking connection");
    } else if (error.message.includes('bad auth')) {
      console.log("\n🔍 DIAGNOSIS: Authentication failed");
      console.log("Wrong username or password in connection string");
    } else if (error.message.includes('querySrv')) {
      console.log("\n🔍 DIAGNOSIS: DNS SRV lookup failed");
      console.log("Your DNS cannot resolve MongoDB domain");
      console.log("SOLUTION: Use mobile hotspot OR get standard connection string from Atlas");
    }
    
    console.log("\n");
    process.exit(1);
  }
};

connectDb();
