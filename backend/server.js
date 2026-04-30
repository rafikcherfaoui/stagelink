const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
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

// test route — just to confirm the server is working
app.get('/', (req, res) => {
  res.json({ message: 'StageLink API is running' })
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
})