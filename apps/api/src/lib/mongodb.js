const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error("❌ MONGODB_URI is not set!");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB Atlas...");

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 60000,
      retryWrites: true,
    });

    console.log("✅ Successfully connected to MongoDB Atlas");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };
