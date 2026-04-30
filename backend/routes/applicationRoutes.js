const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const Application = require('../models/Application')
const Offer = require('../models/Offer')
const User = require('../models/User')
const Company = require('../models/Company')
const Notification = require('../models/Notification')
const { protect, authorizeRoles } = require('../middleware/auth')
const { sendEmail, applicationAcceptedTemplate, applicationRejectedTemplate } = require('../config/email')

// ────────────────────────────────────────────
// @route   POST /api/applications/:offer_id
// @desc    Student applies to an offer (max 3)
// @access  Private — student only
// ────────────────────────────────────────────
const applyToOffer = asyncHandler(async (req, res) => {

  const offer = await Offer.findById(req.params.offer_id)

  if (!offer || offer.status !== 'published') {
    return res.status(404).json({ message: 'Offre non trouvée ou non disponible' })
  }

  const alreadyApplied = await Application.findOne({
    offer_id: req.params.offer_id,
    student_id: req.user.id
  })

  if (alreadyApplied) {
    return res.status(400).json({ message: 'Vous avez déjà postulé à cette offre' })
  }

  const applicationCount = await Application.countDocuments({
    student_id: req.user.id,
    status: 'pending'
  })

  if (applicationCount >= 3) {
    return res.status(400).json({
      message: 'Limite atteinte — vous ne pouvez pas avoir plus de 3 candidatures en attente'
    })
  }

  const application = await Application.create({
    offer_id: req.params.offer_id,
    student_id: req.user.id,
    status: 'pending'
  })

  res.status(201).json({ message: 'Candidature envoyée avec succès', application })
})

// ────────────────────────────────────────────
// @route   GET /api/applications/my-applications
// @desc    Student sees all their own applications
// @access  Private — student only
// ────────────────────────────────────────────
const getMyApplications = asyncHandler(async (req, res) => {

  const applications = await Application.find({ student_id: req.user.id })
    .populate('offer_id', 'title type location duration company_id')
    .sort({ createdAt: -1 })

  res.json(applications)
})

// ────────────────────────────────────────────
// @route   GET /api/applications/offer/:offer_id
// @desc    Company sees all candidates for their offer
// @access  Private — company only
// ────────────────────────────────────────────
const getOfferApplications = asyncHandler(async (req, res) => {

  const offer = await Offer.findById(req.params.offer_id)

  if (!offer) {
    return res.status(404).json({ message: 'Offre non trouvée' })
  }

  if (offer.company_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé — cette offre ne vous appartient pas' })
  }

  const applications = await Application.find({ offer_id: req.params.offer_id })
    .populate('student_id', 'fullName email speciality level cvPath linkedin github')
    .sort({ createdAt: -1 })

  res.json(applications)
})

// ────────────────────────────────────────────
// @route   PUT /api/applications/:id/status
// @desc    Company accepts or rejects a candidate
// @access  Private — company only
// ────────────────────────────────────────────
const updateApplicationStatus = asyncHandler(async (req, res) => {

  const { status, message } = req.body

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide' })
  }

  const application = await Application.findById(req.params.id)
    .populate('offer_id')

  if (!application) {
    return res.status(404).json({ message: 'Candidature non trouvée' })
  }

  if (application.offer_id.company_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé' })
  }

  application.status = status
  application.message = message || ''
  await application.save()

  res.json({
    message: status === 'accepted' ? 'Candidature acceptée' : 'Candidature refusée',
    application
  })

  // fire-and-forget: notification + email — never block the response
  try {
    const student = await User.findById(application.student_id).select('fullName email')
    const company = await Company.findById(application.offer_id.company_id).select('name')
    const offerTitle = application.offer_id.title
    const companyName = company?.name || ''

    await Notification.create({
      student_id: application.student_id,
      message: status === 'accepted'
        ? `Votre candidature pour "${offerTitle}" chez ${companyName} a été acceptée`
        : `Votre candidature pour "${offerTitle}" chez ${companyName} n'a pas été retenue`,
      type: status,
      offer_title: offerTitle,
      company_name: companyName
    })

    if (student?.email) {
      if (status === 'accepted') {
        sendEmail({
          to: student.email,
          subject: 'Votre candidature a été acceptée — DahlabConnect',
          html: applicationAcceptedTemplate(student.fullName, offerTitle, companyName, message)
        })
      } else {
        sendEmail({
          to: student.email,
          subject: 'Résultat de votre candidature — DahlabConnect',
          html: applicationRejectedTemplate(student.fullName, offerTitle, companyName, message)
        })
      }
    }
  } catch (err) {
    console.error('Side effect error (notification/email):', err.message)
  }
})

// ── register all routes ──
router.post('/:offer_id', protect, authorizeRoles('student'), applyToOffer)
router.get('/my-applications', protect, authorizeRoles('student'), getMyApplications)
router.get('/offer/:offer_id', protect, authorizeRoles('company'), getOfferApplications)
router.put('/:id/status', protect, authorizeRoles('company'), updateApplicationStatus)

module.exports = router
