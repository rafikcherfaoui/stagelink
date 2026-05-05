const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const https = require('https') // built-in Node module — no install needed
const connectDB = require('./config/db')

// load environment variables from .env file
dotenv.config()

// connect to MongoDB Atlas
connectDB()

// create the express app
const app = express()

// middleware — allow the app to read JSON and accept requests from React
app.use(cors())
app.use(express.json())

const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// health check route — used by the self-ping mechanism below
// returns a simple JSON so we can confirm the server is alive
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// test route — just to confirm the server is working
app.get('/', (req, res) => {
  res.json({ message: 'DahlabConnect API is running' })
})

// routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/companies', require('./routes/companyRoutes'))
app.use('/api/offers', require('./routes/offerRoutes'))
app.use('/api/applications', require('./routes/applicationRoutes'))
app.use('/api/recommendations', require('./routes/recommendationRoutes'))
app.use('/api/notifications', require('./routes/notificationRoutes'))

// start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)

  // Keep the server awake on Render free tier.
  // Render shuts down free servers after 15 minutes of inactivity.
  // We ping our own /health endpoint every 14 minutes to prevent that.
  const BACKEND_URL = process.env.BACKEND_URL
  if (BACKEND_URL) {
    setInterval(() => {
      https.get(`${BACKEND_URL}/health`, (res) => {
        console.log(`Self-ping: status ${res.statusCode}`)
      }).on('error', (err) => {
        // Non-fatal — the ping failed but the server is still running
        console.log('Self-ping error:', err.message)
      })
    }, 14 * 60 * 1000) // 14 minutes in milliseconds
    console.log('Self-ping enabled — server will stay awake on Render')
  }
})
