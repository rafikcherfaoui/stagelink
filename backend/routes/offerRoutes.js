const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const Offer = require('../models/Offer')
const { protect, authorizeRoles } = require('../middleware/auth')

// ────────────────────────────────────────────
// @route   POST /api/offers
// @desc    Company creates a new offer
// @access  Private — company only
// ────────────────────────────────────────────
const createOffer = asyncHandler(async (req, res) => {

  const { title, type, description, requiredLevel, duration, location } = req.body

  const offer = await Offer.create({
    company_id: req.user.id,  // taken from the JWT token
    title,
    type,
    description,
    requiredLevel,
    duration,
    location,
    status: 'pending'         // always starts as pending — admin must approve
  })

  res.status(201).json({
    message: 'Offre soumise — en attente de validation par l administration',
    offer
  })
})

// ────────────────────────────────────────────
// @route   GET /api/offers
// @desc    Get all published offers — visible to students
// @access  Private — student only
// ────────────────────────────────────────────
const getPublishedOffers = asyncHandler(async (req, res) => {

  // optional filters
  const filter = { status: 'published' }

  if (req.query.type) {
    filter.type = req.query.type               // filter by stage or emploi
  }

  if (req.query.requiredLevel) {
    filter.requiredLevel = req.query.requiredLevel  // filter by level
  }

  // populate company name so student sees who posted the offer
  const offers = await Offer.find(filter)
    .populate('company_id', 'name sector profilePicture')
    .sort({ createdAt: -1 })                   // newest first

  res.json(offers)
})

// ────────────────────────────────────────────
// @route   GET /api/offers/pending
// @desc    Admin gets all pending offers to moderate
// @access  Private — admin only
// ────────────────────────────────────────────
const getPendingOffers = asyncHandler(async (req, res) => {

  const offers = await Offer.find({ status: 'pending' })
    .populate('company_id', 'name email sector profilePicture')
    .sort({ createdAt: -1 })

  res.json(offers)
})

// ────────────────────────────────────────────
// @route   GET /api/offers/my-offers
// @desc    Company gets their own offers
// @access  Private — company only
// ────────────────────────────────────────────
const getMyOffers = asyncHandler(async (req, res) => {

  const offers = await Offer.find({ company_id: req.user.id })
    .sort({ createdAt: -1 })

  res.json(offers)
})

// ────────────────────────────────────────────
// @route   GET /api/offers/:id
// @desc    Get one offer by id
// @access  Private
// ────────────────────────────────────────────
const getOfferById = asyncHandler(async (req, res) => {

  const offer = await Offer.findById(req.params.id)
    .populate('company_id', 'name sector address phone profilePicture')

  if (!offer) {
    return res.status(404).json({ message: 'Offre non trouvée' })
  }

  res.json(offer)
})

// ────────────────────────────────────────────
// @route   PUT /api/offers/:id/status
// @desc    Admin approves or rejects an offer
// @access  Private — admin only
// ────────────────────────────────────────────
const updateOfferStatus = asyncHandler(async (req, res) => {

  const { status } = req.body

  if (!['published', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide' })
  }

  const offer = await Offer.findById(req.params.id)

  if (!offer) {
    return res.status(404).json({ message: 'Offre non trouvée' })
  }

  offer.status = status
  await offer.save()

  res.json({
    message: status === 'published' ? 'Offre publiée avec succès' : 'Offre rejetée',
    offer
  })
})

// ────────────────────────────────────────────
// @route   PUT /api/offers/:id
// @desc    Company updates their own offer
// @access  Private — company only
// ────────────────────────────────────────────
const updateOffer = asyncHandler(async (req, res) => {

  const offer = await Offer.findById(req.params.id)

  if (!offer) {
    return res.status(404).json({ message: 'Offre non trouvée' })
  }

  // make sure the company can only update their own offers
  if (offer.company_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé — cette offre ne vous appartient pas' })
  }

  offer.title = req.body.title || offer.title
  offer.type = req.body.type || offer.type
  offer.description = req.body.description || offer.description
  offer.requiredLevel = req.body.requiredLevel || offer.requiredLevel
  offer.duration = req.body.duration || offer.duration
  offer.location = req.body.location || offer.location
  offer.status = 'pending'  // reset to pending after edit — needs re-approval

  await offer.save()

  res.json({
    message: 'Offre mise à jour — en attente de re-validation',
    offer
  })
})

// ────────────────────────────────────────────
// @route   DELETE /api/offers/:id
// @desc    Company deletes their own offer
// @access  Private — company only
// ────────────────────────────────────────────
const deleteOffer = asyncHandler(async (req, res) => {

  const offer = await Offer.findById(req.params.id)

  if (!offer) {
    return res.status(404).json({ message: 'Offre non trouvée' })
  }

  // make sure the company can only delete their own offers
  if (offer.company_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé — cette offre ne vous appartient pas' })
  }

  await offer.deleteOne()

  res.json({ message: 'Offre supprimée avec succès' })
})

// ── register all routes ──
router.post('/', protect, authorizeRoles('company'), createOffer)
router.get('/', protect, authorizeRoles('student'), getPublishedOffers)
router.get('/pending', protect, authorizeRoles('admin'), getPendingOffers)
router.get('/my-offers', protect, authorizeRoles('company'), getMyOffers)
router.get('/:id', protect, getOfferById)
router.put('/:id/status', protect, authorizeRoles('admin'), updateOfferStatus)
router.put('/:id', protect, authorizeRoles('company'), updateOffer)
router.delete('/:id', protect, authorizeRoles('company'), deleteOffer)

module.exports = router