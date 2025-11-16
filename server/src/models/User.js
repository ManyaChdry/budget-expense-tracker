import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: String,
  refreshTokens: [{ token: String, createdAt: Date }]
}, { timestamps: true })
export default mongoose.model('User', userSchema)