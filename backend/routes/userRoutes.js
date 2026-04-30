const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const { protect, authorizeRoles } = require('../middleware/auth')
const upload = require('../middleware/upload')
const { uploadImage } = require('../middleware/upload')
const { sendEmail, accountCreatedTemplate } = require('../config/email')

// ── generate a random 8 character password ──
const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// ────────────────────────────────────────────
// @route   POST /api/users/create
// @desc    Admin creates a student or teacher account
// @access  Private — admin only
// ────────────────────────────────────────────
const createUser = asyncHandler(async (req, res) => {

  const { fullName, email, role, speciality, level, phone } = req.body

  if (!['student', 'teacher'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide — student ou teacher uniquement' })
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.status(400).json({ message: 'Cet email est déjà utilisé' })
  }

  const rawPassword = generatePassword()
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(rawPassword, salt)

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    tempPassword: rawPassword,
    role,
    speciality: speciality || '',
    level: level || '',
    phone: phone || '',
    isActive: true,
    createdBy: req.user.id
  })

  res.status(201).json({
    message: `Compte ${role} créé avec succès`,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      speciality: user.speciality,
      level: user.level,
      isActive: user.isActive
    },
    temporaryPassword: rawPassword
  })

  // fire-and-forget welcome email
  sendEmail({
    to: email,
    subject: 'Bienvenue sur StageLink — Vos identifiants de connexion',
    html: accountCreatedTemplate(fullName, email, rawPassword, role)
  })
})

// ────────────────────────────────────────────
// @route   GET /api/users
// @desc    Get all users (with optional role filter)
// @access  Private — admin only
// ────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {

  const filter = {}
  if (req.query.role) filter.role = req.query.role

  const users = await User.find(filter).select('-password')
  res.json(users)
})

// ────────────────────────────────────────────
// @route   GET /api/users/me
// @desc    Current user gets their own full profile
// @access  Private — student and teacher
// ────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id).select('-password -tempPassword')

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' })
  }

  res.json(user)
})

// ────────────────────────────────────────────
// @route   GET /api/users/:id/password
// @desc    Admin views the temporary password of a student or teacher
// @access  Private — admin only
// ────────────────────────────────────────────
const getUserPassword = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' })
  }

  if (!['student', 'teacher'].includes(user.role)) {
    return res.status(403).json({ message: 'Accès refusé — uniquement pour étudiants et enseignants' })
  }

  if (!user.tempPassword) {
    return res.json({ message: "L'utilisateur a déjà modifié son mot de passe" })
  }

  res.json({ tempPassword: user.tempPassword })
})

// ────────────────────────────────────────────
// @route   GET /api/users/:id
// @desc    Get one user by id
// @access  Private — admin and teacher
// ────────────────────────────────────────────
const getUserById = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' })
  }

  res.json(user)
})

// ────────────────────────────────────────────
// @route   PUT /api/users/:id/block
// @desc    Admin blocks or unblocks a user
// @access  Private — admin only
// ────────────────────────────────────────────
const toggleBlockUser = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' })
  }

  if (user.role === 'admin') {
    return res.status(400).json({ message: 'Impossible de bloquer un admin' })
  }

  user.isActive = !user.isActive
  await user.save()

  res.json({
    message: user.isActive ? 'Compte débloqué avec succès' : 'Compte bloqué avec succès',
    isActive: user.isActive
  })
})

// ────────────────────────────────────────────
// @route   DELETE /api/users/:id
// @desc    Admin soft deletes a user
// @access  Private — admin only
// ────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' })
  }

  if (user.role === 'admin') {
    return res.status(400).json({ message: 'Impossible de supprimer un admin' })
  }

  user.isActive = false
  await user.save()

  res.json({ message: 'Compte désactivé avec succès' })
})

// ────────────────────────────────────────────
// @route   PUT /api/users/profile
// @desc    Student or teacher updates their own profile
// @access  Private — student and teacher
// ────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id)

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' })
  }

  user.fullName   = req.body.fullName   || user.fullName
  user.phone      = req.body.phone      || user.phone
  user.speciality = req.body.speciality || user.speciality
  user.level      = req.body.level      || user.level
  user.linkedin   = req.body.linkedin   || user.linkedin
  user.github     = req.body.github     || user.github

  await user.save()

  res.json({
    message: 'Profil mis à jour avec succès',
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      speciality: user.speciality,
      level: user.level,
      linkedin: user.linkedin,
      github: user.github
    }
  })
})

// ────────────────────────────────────────────
// @route   PUT /api/users/change-password
// @desc    Any logged in user changes their password
// @access  Private
// ────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {

  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user.id)

  const isMatch = await bcrypt.compare(oldPassword, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Ancien mot de passe incorrect' })
  }

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(newPassword, salt)
  user.tempPassword = ''
  await user.save()

  res.json({ message: 'Mot de passe modifié avec succès' })
})

// ────────────────────────────────────────────
// @route   POST /api/users/upload-cv
// @desc    Student uploads their CV as PDF
// @access  Private — student only
// ────────────────────────────────────────────
const uploadCV = asyncHandler(async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier reçu' })
  }

  const user = await User.findById(req.user.id)

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' })
  }

  user.cvPath = req.file.path
  await user.save()

  res.json({ message: 'CV uploadé avec succès', cvPath: req.file.path })
})

// ────────────────────────────────────────────
// @route   POST /api/users/upload-picture
// @desc    Student uploads their profile picture
// @access  Private — student only
// ────────────────────────────────────────────
const uploadPicture = asyncHandler(async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier reçu' })
  }

  const user = await User.findById(req.user.id)

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' })
  }

  user.profilePicture = req.file.path
  await user.save()

  res.json({ message: 'Photo de profil mise à jour', profilePicture: req.file.path })
})

// ── register all routes — static paths before parameterized ones ──
router.post('/create',         protect, authorizeRoles('admin'),             createUser)
router.get('/',                protect, authorizeRoles('admin'),             getAllUsers)
router.get('/me',              protect, authorizeRoles('student', 'teacher'), getMe)
router.put('/profile',         protect, authorizeRoles('student', 'teacher'), updateProfile)
router.put('/change-password', protect,                                       changePassword)
router.post('/upload-cv',      protect, authorizeRoles('student'),            upload.single('cv'),      uploadCV)
router.post('/upload-picture', protect, authorizeRoles('student'),            uploadImage.single('picture'), uploadPicture)
router.get('/:id/password',    protect, authorizeRoles('admin'),             getUserPassword)
router.get('/:id',             protect, authorizeRoles('admin', 'teacher'),  getUserById)
router.put('/:id/block',       protect, authorizeRoles('admin'),             toggleBlockUser)
router.delete('/:id',          protect, authorizeRoles('admin'),             deleteUser)

module.exports = router
