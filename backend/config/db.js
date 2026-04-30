const mongoose = require('mongoose')

// This function connects our server to MongoDB Atlas
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected : ${conn.connection.host}`)
  } catch (error) {
    console.log(`Error : ${error.message}`)
    process.exit(1) // stop the server if connection fails
  }
}

module.exports = connectDB