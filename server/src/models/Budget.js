import mongoose from 'mongoose'
const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  month: String,
  amount: Number,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true })
export default mongoose.model('Budget', budgetSchema)