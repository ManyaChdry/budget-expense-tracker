import { Router } from 'express'
import Expense from '../models/Expense.js'
import Budget from '../models/Budget.js'
import { requireAuth } from '../middleware/auth.js'
const router = Router()
router.use(requireAuth)

const monthKey = d => {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}
const rangeForMonth = (month) => {
  const start = new Date(`${month}-01T00:00:00.000Z`)
  const end = new Date(start)
  end.setUTCMonth(end.getUTCMonth() + 1)
  return { start, end }
}

router.get('/', async (req, res) => {
  const page = Number(req.query.page || 1)
  const limit = Number(req.query.limit || 20)
  const skip = (page - 1) * limit
  const rows = await Expense.find({ userId: req.user.id, isDeleted: false }).sort({ date: -1 }).skip(skip).limit(limit).populate('categoryId')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { date, expense, expenseName, Category } = req.body
  const row = await Expense.create({ userId: req.user.id, categoryId: Category, expenseName, amount: expense, date })
  const month = monthKey(date || new Date())
  const budget = await Budget.findOne({ userId: req.user.id, categoryId: Category, month, isDeleted: false })
  const { start, end } = rangeForMonth(month)
  const spentAgg = await Expense.aggregate([
    { $match: { userId: row.userId, categoryId: row.categoryId, isDeleted: false, date: { $gte: start, $lt: end } } },
    { $group: { _id: null, sum: { $sum: '$amount' } } }
  ])
  const spent = spentAgg[0]?.sum || 0
  const limit = budget?.amount || 0
  const withinBudget = spent <= limit
  res.json({ expense: row, withinBudget, overBudget: !withinBudget, spent, limit })
})

router.patch('/:id', async (req, res) => {
  const { date, expense, expenseName, Category } = req.body
  const row = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { ...(date !== undefined ? { date } : {}), ...(expense !== undefined ? { amount: expense } : {}), ...(expenseName !== undefined ? { expenseName } : {}), ...(Category !== undefined ? { categoryId: Category } : {}) },
    { new: true }
  )
  res.json(row)
})

router.delete('/:id', async (req, res) => {
  const row = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { isDeleted: true }, { new: true })
  res.json(row)
})

export default router