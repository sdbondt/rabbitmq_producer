import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import authRouter from '../routes/authRoutes'
import errorHandler from '../handlers/errorHandler'
import notFoundHandler from '../handlers/notFoundHandler'
import { AUTH_ROUTE } from '../constants/routes'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(helmet())
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000
}))

app.use(AUTH_ROUTE, authRouter)

app.use(errorHandler)
app.use(notFoundHandler)

export default app