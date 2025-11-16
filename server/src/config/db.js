import mongoose from 'mongoose'
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not set')
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    }).connection;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}