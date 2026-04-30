const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({

  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // the teacher who wrote the letter
    required: true
  },

  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // the student being recommended
    required: true
  },

  content: {
    type: String,
    required: true    // the actual text of the recommendation letter
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Recommendation', recommendationSchema)