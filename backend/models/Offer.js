const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({

  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',   // which company posted this offer
    required: true
  },

  title: {
    type: String,
    required: true    // ex: Développeur Web Full Stack
  },

  type: {
    type: String,
    enum: ['stage', 'emploi'],
    required: true
  },

  description: {
    type: String,
    required: true
  },

  requiredLevel: {
    type: String,
    enum: ['L2', 'L3', 'M1', 'M2', 'tout'],
    required: true
  },

  duration: {
    type: String,
    default: ''       // ex: 3 mois, CDI, CDD 12 mois
  },

  location: {
    type: String,
    default: ''       // ex: Alger, Blida
  },

  status: {
    type: String,
    enum: ['pending', 'published', 'rejected'],
    default: 'pending'  // every new offer waits for admin approval
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Offer', offerSchema)