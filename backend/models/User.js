const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true  // this field is mandatory
  },

  email: {
    type: String,
    required: true,
    unique: true    // no two users can have the same email
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['admin', 'student', 'teacher'], // only these 3 values allowed
    required: true
  },

  phone: {
    type: String,
    default: ''     // optional — empty string if not provided
  },

  speciality: {
    type: String,
    default: ''     // optional — mainly for students and teachers
  },

  level: {
    type: String,
    enum: ['L2', 'L3', 'M1', 'M2', ''],
    default: ''     // optional — only relevant for students
  },

  cvPath: {
    type: String,
    default: ''     // stores the path to the uploaded PDF
  },

  isActive: {
    type: Boolean,
    default: true   // false = account blocked by admin
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    // references another user (the admin who created this account)
    default: null
  },

  tempPassword: {
    type: String,
    default: ''
  },

  profilePicture: { type: String, default: '' },
  linkedin:       { type: String, default: '' },
  github:         { type: String, default: '' }

}, {
  timestamps: true  // automatically adds createdAt and updatedAt fields
})

module.exports = mongoose.model('User', userSchema)