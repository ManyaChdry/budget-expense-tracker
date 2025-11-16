import { Router } from 'express'
import Expense from '../models/Expense.js'
import Budget from '../models/Budget.js'
import Category from '../models/Category.js'
import { requireAuth } from '../middleware/auth.js'
const router = Router()
router.use(requireAuth)

const rangeForMonth = (month) => {
  const start = new Date(`${month}-01T00:00:00.000Z`)
  const end = new Date(start)
  end.setUTCMonth(end.getUTCMonth() + 1)
  return { start, end }
}

router.get('/category-budget-report', async (req, res) => {
  const { month } = req.query
  if (!month) return res.status(400).json({ message: 'month required YYYY-MM' })
  const categories = await Category.find({ userId: req.user.id, isDeleted: false })
  const budgets = await Budget.find({ userId: req.user.id, month, isDeleted: false })
  const { start, end } = rangeForMonth(month)
  const expenses = await Expense.aggregate([
    { $match: { userId: categories[0]?.userId || req.user.id, isDeleted: false, date: { $gte: start, $lt: end } } },
    { $group: { _id: '$categoryId', spent: { $sum: '$amount' } } }
  ])
  const spentMap = new Map(expenses.map(e => [String(e._id), e.spent]))
  const budgetMap = new Map(budgets.map(b => [String(b.categoryId), b.amount]))
  const rows = categories.map(c => {
    const spent = spentMap.get(String(c._id)) || 0
    const budget = budgetMap.get(String(c._id)) || 0
    const remaining = budget - spent
    return { categoryId: c._id, name: c.name, colorHex: c.colorHex, spent, budget, remaining, overBudget: remaining < 0 }
  })
  res.json(rows)
})

export default router