import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
const router = Router()

const issueAccess = userId => jwt.sign({}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN, subject: String(userId) })
const issueRefresh = userId => jwt.sign({}, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN, subject: String(userId) })

router.post('/sign-up', async (req, res) => {
  const { Email, Password } = req.body
  if (!Email || !Password) return res.status(400).json({ message: 'Invalid' })
  const exists = await User.findOne({ email: Email })
  if (exists) return res.status(409).json({ message: 'Email exists' })
  const passwordHash = await bcrypt.hash(Password, 10)
  const user = await User.create({ email: Email, passwordHash })
  const accessToken = issueAccess(user._id)
  const refreshToken = issueRefresh(user._id)
  user.refreshTokens.push({ token: refreshToken, createdAt: new Date() })
  await user.save()
  res.json({ accessToken, refreshToken })
})

router.post('/login', async (req, res) => {
  const { Email, Password } = req.body
  const user = await User.findOne({ email: Email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(Password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const accessToken = issueAccess(user._id)
  const refreshToken = issueRefresh(user._id)
  user.refreshTokens.push({ token: refreshToken, createdAt: new Date() })
  await user.save()
  res.json({ accessToken, refreshToken })
})

router.post('/get-access-token', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' })
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
    const user = await User.findById(payload.sub)
    const found = user?.refreshTokens.find(rt => rt.token === refreshToken)
    if (!found) return res.status(401).json({ message: 'Invalid refreshToken' })
    const accessToken = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN, subject: String(payload.sub) })
    res.json({ accessToken })
  } catch {
    res.status(401).json({ message: 'Invalid refreshToken' })
  }
})

export default router