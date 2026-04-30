const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({

  offer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',     // which offer the student applied to
    required: true
  },

  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // which student applied
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'  // starts as pending until company decides
  },

  message: {
    type: String,
    default: ''       // optional message from the company when accepting or rejecting
  }

}, {
  timestamps: true    // appliedAt is handled by createdAt
})

module.exports = mongoose.model('Application', applicationSchema)