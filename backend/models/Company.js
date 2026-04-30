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
    default: ''
  },

  phone: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blocked'],
    default: 'pending'
  },

  profilePicture: { type: String, default: '' },
  website:        { type: String, default: '' },
  linkedin:       { type: String, default: '' },
  description:    { type: String, default: '' }

}, {
  timestamps: true
})

module.exports = mongoose.model('Company', companySchema)