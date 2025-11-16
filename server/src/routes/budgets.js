import { Router } from 'express'
import Budget from '../models/Budget.js'
import { requireAuth } from '../middleware/auth.js'
const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  const { month } = req.query
  const rows = await Budget.find({ userId: req.user.id, isDeleted: false, ...(month ? { month } : {}) }).populate('categoryId')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { categoryId, month, amount } = req.body
  const row = await Budget.create({ userId: req.user.id, categoryId, month, amount })
  res.json(row)
})

router.patch('/:id', async (req, res) => {
  const row = await Budget.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true })
  res.json(row)
})

router.delete('/:id', async (req, res) => {
  const row = await Budget.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { isDeleted: true }, { new: true })
  res.json(row)
})

export default router