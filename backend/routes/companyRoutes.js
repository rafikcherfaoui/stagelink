const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const Company = require('../models/Company')
const { protect, authorizeRoles } = require('../middleware/auth')
const { uploadImage } = require('../middleware/upload')

// ────────────────────────────────────────────
// @route   GET /api/companies
// @desc    Admin gets all companies
// @access  Private — admin only
// ────────────────────────────────────────────
const getAllCompanies = asyncHandler(async (req, res) => {

  const filter = {}
  if (req.query.status) {
    filter.status = req.query.status
  }

  const companies = await Company.find(filter).select('-password')
  res.json(companies)
})

// ────────────────────────────────────────────
// @route   GET /api/companies/profile
// @desc    Company gets their own profile
// @access  Private — company only
// ────────────────────────────────────────────
const getCompanyProfile = asyncHandler(async (req, res) => {

  const company = await Company.findById(req.user.id).select('-password')

  if (!company) {
    return res.status(404).json({ message: 'Entreprise non trouvée' })
  }

  res.json(company)
})

// ────────────────────────────────────────────
// @route   PUT /api/companies/profile
// @desc    Company updates their own profile
// @access  Private — company only
// ────────────────────────────────────────────
const updateCompanyProfile = asyncHandler(async (req, res) => {

  const company = await Company.findById(req.user.id)

  if (!company) {
    return res.status(404).json({ message: 'Entreprise non trouvée' })
  }

  if (req.body.name)        company.name        = req.body.name
  if (req.body.sector)      company.sector      = req.body.sector
  if (req.body.address !== undefined) company.address = req.body.address
  if (req.body.phone   !== undefined) company.phone   = req.body.phone
  if (req.body.website !== undefined) company.website = req.body.website
  if (req.body.linkedin !== undefined) company.linkedin = req.body.linkedin
  if (req.body.description !== undefined) company.description = req.body.description

  await company.save()

  res.json({
    message: 'Profil mis à jour avec succès',
    company: {
      _id: company._id,
      name: company.name,
      email: company.email,
      sector: company.sector,
      address: company.address,
      phone: company.phone,
      website: company.website,
      linkedin: company.linkedin,
      description: company.description,
      profilePicture: company.profilePicture
    }
  })
})

// ────────────────────────────────────────────
// @route   POST /api/companies/upload-picture
// @desc    Company uploads their profile picture
// @access  Private — company only
// ────────────────────────────────────────────
const uploadCompanyPicture = asyncHandler(async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier reçu' })
  }

  const company = await Company.findById(req.user.id)

  if (!company) {
    return res.status(404).json({ message: 'Entreprise non trouvée' })
  }

  company.profilePicture = req.file.path
  await company.save()

  res.json({
    message: 'Photo de profil mise à jour',
    profilePicture: req.file.path
  })
})

// ────────────────────────────────────────────
// @route   GET /api/companies/:id
// @desc    Get one company by id
// @access  Private — admin only
// ────────────────────────────────────────────
const getCompanyById = asyncHandler(async (req, res) => {

  const company = await Company.findById(req.params.id).select('-password')

  if (!company) {
    return res.status(404).json({ message: 'Entreprise non trouvée' })
  }

  res.json(company)
})

// ────────────────────────────────────────────
// @route   PUT /api/companies/:id/status
// @desc    Admin approves, rejects or blocks a company
// @access  Private — admin only
// ────────────────────────────────────────────
const updateCompanyStatus = asyncHandler(async (req, res) => {

  const { status } = req.body

  if (!['approved', 'rejected', 'blocked'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide' })
  }

  const company = await Company.findById(req.params.id)

  if (!company) {
    return res.status(404).json({ message: 'Entreprise non trouvée' })
  }

  company.status = status
  await company.save()

  const messages = {
    approved: 'Entreprise approuvée avec succès',
    rejected: 'Entreprise rejetée',
    blocked: 'Entreprise bloquée'
  }

  res.json({
    message: messages[status],
    company: { _id: company._id, name: company.name, email: company.email, status: company.status }
  })
})

// ── register all routes — static paths before parameterized ones ──
router.get('/', protect, authorizeRoles('admin'), getAllCompanies)
router.get('/profile', protect, authorizeRoles('company'), getCompanyProfile)
router.put('/profile', protect, authorizeRoles('company'), updateCompanyProfile)
router.post('/upload-picture', protect, authorizeRoles('company'), uploadImage.single('picture'), uploadCompanyPicture)
router.get('/:id', protect, authorizeRoles('admin'), getCompanyById)
router.put('/:id/status', protect, authorizeRoles('admin'), updateCompanyStatus)

module.exports = router
