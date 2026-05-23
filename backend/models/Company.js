const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true    // no two companies with the same email
  },

  password: {
    type: String,
    required: true
  },

  sector: {
    type: String,
    required: true  // ex: Informatique, Finance, Telecom
  },

  address: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blocked'],
    default: 'pending'
  },

  profilePicture: { type: String, default: '' },
  website:        { type: String, default: '' },
  linkedin:       { type: String, default: '' },
  description:    { type: String, default: '' },
  
  // token sent by email when company requests a password reset
  resetPasswordToken: {
    type: String,
    default: null
  },

  // expiry date — valid for 1 hour only
  resetPasswordExpires: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Company', companySchema)