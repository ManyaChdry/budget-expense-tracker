import mongoose from 'mongoose'
const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  name: String,
  colorHex: String,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true })
export default mongoose.model('Category', categorySchema)