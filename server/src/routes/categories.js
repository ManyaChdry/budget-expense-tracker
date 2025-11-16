import { Router } from 'express'
import Category from '../models/Category.js'
import { requireAuth } from '../middleware/auth.js'
const router = Router()

router.use(requireAuth)

router.get('/', async (req, res) => {
  const rows = await Category.find({ userId: req.user.id, isDeleted: false }).sort('name')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { name, colorHex } = req.body
  const row = await Category.create({ userId: req.user.id, name, colorHex })
  res.json(row)
})

router.patch('/:id', async (req, res) => {
  const row = await Category.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true })
  res.json(row)
})

router.delete('/:id', async (req, res) => {
  const row = await Category.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { isDeleted: true }, { new: true })
  res.json(row)
})

export default router