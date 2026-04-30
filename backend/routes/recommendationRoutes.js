const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const Recommendation = require('../models/Recommendation')
const RecommendationRequest = require('../models/RecommendationRequest')
const User = require('../models/User')
const { protect, authorizeRoles } = require('../middleware/auth')

// ────────────────────────────────────────────
// @route   GET /api/recommendations/teachers
// @desc    Student sees all active teachers
// @access  Private — student only
// ────────────────────────────────────────────
const getAllTeachers = asyncHandler(async (req, res) => {

  const teachers = await User.find({ 
    role: 'teacher', 
    isActive: true 
  }).select('fullName email speciality')

  res.json(teachers)
})

// ────────────────────────────────────────────
// @route   POST /api/recommendations/request/:teacher_id
// @desc    Student sends a recommendation request to a teacher
// @access  Private — student only
// ────────────────────────────────────────────
const sendRequest = asyncHandler(async (req, res) => {

  const teacher = await User.findById(req.params.teacher_id)

  // check if teacher exists and is active
  if (!teacher || teacher.role !== 'teacher' || !teacher.isActive) {
    return res.status(404).json({ message: 'Enseignant non trouvé' })
  }

  // check if student already sent a request to this teacher
  const alreadyRequested = await RecommendationRequest.findOne({
    student_id: req.user.id,
    teacher_id: req.params.teacher_id,
    status: 'pending'
  })

  if (alreadyRequested) {
    return res.status(400).json({ 
      message: 'Vous avez déjà envoyé une demande à cet enseignant' 
    })
  }

  const request = await RecommendationRequest.create({
    student_id: req.user.id,
    teacher_id: req.params.teacher_id,
    message: req.body.message || '',
    status: 'pending'
  })

  res.status(201).json({
    message: 'Demande envoyée avec succès',
    request
  })
})

// ────────────────────────────────────────────
// @route   GET /api/recommendations/requests
// @desc    Teacher sees all pending requests sent to them
// @access  Private — teacher only
// ────────────────────────────────────────────
const getMyRequests = asyncHandler(async (req, res) => {

  const requests = await RecommendationRequest.find({
    teacher_id: req.user.id,
    status: 'pending'
  })
  .populate('student_id', 'fullName email speciality level cvPath')
  .sort({ createdAt: -1 })

  res.json(requests)
})

// ────────────────────────────────────────────
// @route   POST /api/recommendations/write/:request_id
// @desc    Teacher writes a recommendation letter for a student
// @access  Private — teacher only
// ────────────────────────────────────────────
const writeRecommendation = asyncHandler(async (req, res) => {

  const { content } = req.body

  if (!content) {
    return res.status(400).json({ message: 'Le contenu de la lettre est obligatoire' })
  }

  const request = await RecommendationRequest.findById(req.params.request_id)

  if (!request) {
    return res.status(404).json({ message: 'Demande non trouvée' })
  }

  // make sure the teacher can only respond to their own requests
  if (request.teacher_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé' })
  }

  // create the recommendation letter
  const recommendation = await Recommendation.create({
    teacher_id: req.user.id,
    student_id: request.student_id,
    content
  })

  // mark the request as accepted
  request.status = 'accepted'
  await request.save()

  res.status(201).json({
    message: 'Lettre de recommandation rédigée avec succès',
    recommendation
  })
})

// ────────────────────────────────────────────
// @route   PUT /api/recommendations/request/:request_id/ignore
// @desc    Teacher ignores a recommendation request
// @access  Private — teacher only
// ────────────────────────────────────────────
const ignoreRequest = asyncHandler(async (req, res) => {

  const request = await RecommendationRequest.findById(req.params.request_id)

  if (!request) {
    return res.status(404).json({ message: 'Demande non trouvée' })
  }

  if (request.teacher_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé' })
  }

  request.status = 'ignored'
  await request.save()

  res.json({ message: 'Demande ignorée' })
})

// ────────────────────────────────────────────
// @route   GET /api/recommendations/my-letters
// @desc    Student sees all recommendation letters they received
// @access  Private — student only
// ────────────────────────────────────────────
const getMyLetters = asyncHandler(async (req, res) => {

  const letters = await Recommendation.find({ student_id: req.user.id })
    .populate('teacher_id', 'fullName email speciality')
    .sort({ createdAt: -1 })

  res.json(letters)
})

// ────────────────────────────────────────────
// @route   GET /api/recommendations/sent
// @desc    Teacher sees all letters they have written
// @access  Private — teacher only
// ────────────────────────────────────────────
const getSentLetters = asyncHandler(async (req, res) => {

  const letters = await Recommendation.find({ teacher_id: req.user.id })
    .populate('student_id', 'fullName email speciality level')
    .sort({ createdAt: -1 })

  res.json(letters)
})

// ────────────────────────────────────────────
// @route   GET /api/recommendations/student/:student_id
// @desc    Company sees recommendation letters of a specific student
// @access  Private — company only
// ────────────────────────────────────────────
const getStudentLetters = asyncHandler(async (req, res) => {

  const letters = await Recommendation.find({ 
    student_id: req.params.student_id 
  })
  .populate('teacher_id', 'fullName email speciality')
  .sort({ createdAt: -1 })

  res.json(letters)
})

// ── register all routes ──
router.get('/teachers', protect, authorizeRoles('student'), getAllTeachers)
router.post('/request/:teacher_id', protect, authorizeRoles('student'), sendRequest)
router.get('/requests', protect, authorizeRoles('teacher'), getMyRequests)
router.post('/write/:request_id', protect, authorizeRoles('teacher'), writeRecommendation)
router.put('/request/:request_id/ignore', protect, authorizeRoles('teacher'), ignoreRequest)
router.get('/my-letters', protect, authorizeRoles('student'), getMyLetters)
router.get('/sent', protect, authorizeRoles('teacher'), getSentLetters)
router.get('/student/:student_id', protect, authorizeRoles('company'), getStudentLetters)

module.exports = router