import mongoose from 'mongoose'
const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  expenseName: String,
  amount: Number,
  date: Date,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true })
export default mongoose.model('Expense', expenseSchema)