const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({

  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  message: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ['accepted', 'rejected'],
    required: true
  },

  isRead: {
    type: Boolean,
    default: false
  },

  offer_title: {
    type: String,
    default: ''
  },

  company_name: {
    type: String,
    default: ''
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Notification', notificationSchema)
