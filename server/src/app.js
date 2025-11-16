import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import authRouter from './routes/auth.js'
import categoriesRouter from './routes/categories.js'
import budgetsRouter from './routes/budgets.js'
import expensesRouter from './routes/expenses.js'
import reportsRouter from './routes/reports.js'

dotenv.config()
const app = express()

connectDB();

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(morgan('dev'))
app.use(async (_req, _res, next) => {
    await connectDB()
    next()
})

app.get('/', (_req, res) => {
    res.send('Budget Expense Tracker API')
})
app.use('/api/auth', authRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/budgets', budgetsRouter)
app.use('/api/expenses', expensesRouter)
app.use('/api/reports', reportsRouter)

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
export default (req, res) => app(req, res)