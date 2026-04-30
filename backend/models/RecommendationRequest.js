const mongoose = require('mongoose')

const recommendationRequestSchema = new mongoose.Schema({

  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // the student who sent the request
    required: true
  },

  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // the teacher being asked
    required: true
  },

  message: {
    type: String,
    default: ''       // optional message from the student explaining why they ask
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'ignored'],
    default: 'pending'
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('RecommendationRequest', recommendationRequestSchema)