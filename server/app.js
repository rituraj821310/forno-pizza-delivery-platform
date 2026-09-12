import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { nodeEnv, clientOrigin } from './config/env.js'

import authRoutes from './routes/authRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

import notFound from './middleware/notFound.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

// --------------------------------------------------
// Resolve current directory (ES Module)
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// --------------------------------------------------
// Serve static files from /server/public
// --------------------------------------------------

app.use(express.static(path.join(__dirname, 'public')))

// --------------------------------------------------
// Security
// --------------------------------------------------

app.use(helmet())

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
)

// --------------------------------------------------
// Body Parser
// --------------------------------------------------

app.use(express.json())

// --------------------------------------------------
// Logging
// --------------------------------------------------

if (nodeEnv !== 'test') {
  app.use(
    morgan(
      nodeEnv === 'production'
        ? 'combined'
        : 'dev'
    )
  )
}

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: nodeEnv,
    time: new Date().toISOString(),
  })
})

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use('/api/auth', authRoutes)

app.use('/api/menu', menuRoutes)

app.use('/api/orders', orderRoutes)

app.use('/api/users', userRoutes)

app.use('/api/payments', paymentRoutes)

app.use('/api/admin', adminRoutes)

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use(notFound)

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

app.use(errorHandler)

export default app