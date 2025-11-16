import mongoose from 'mongoose'
let conn
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not set')
  if (!conn) {
    conn = mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 }).then(() => {
      console.log('MongoDB connected successfully')
    }).catch((err) => {
      console.error('MongoDB connection failed:', err)
    })
  }
  return conn;
}