const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Company = require('../models/Company')

// ── helper function to generate a JWT token ──
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },                        // payload — what we store inside the token
    process.env.JWT_SECRET,              // secret key from .env
    { expiresIn: '7d' }                  // token expires after 7 days
  )
}

// ────────────────────────────────────────────
// @route   POST /api/auth/seed-admin
// @desc    Create the admin account once
// @access  Public — run this only one time
// ────────────────────────────────────────────
const seedAdmin = asyncHandler(async (req, res) => {

  // check if admin already exists
  const adminExists = await User.findOne({ role: 'admin' })

  if (adminExists) {
    return res.status(400).json({ message: 'Admin already exists' })
  }

  // hash the password before saving
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash('admin1234', salt)

  // create the admin user
  const admin = await User.create({
    fullName: 'Administrateur DahlabConnect',
    email: 'admin@univ-blida.dz',
    password: hashedPassword,
    role: 'admin'
  })

  res.status(201).json({
    message: 'Admin created successfully',
    email: admin.email,
    password: 'admin1234'   // shown only this once — change it after
  })
})

// ────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login for admin, student, teacher
// @access  Public
// ────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body

  // find the user by email
  const user = await User.findOne({ email })

  // check if user exists
  if (!user) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
  }

  // check if account is active
  if (!user.isActive) {
    return res.status(403).json({ message: 'Compte bloqué — contactez l administration' })
  }

  // check if password matches
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
  }

  // everything is correct — send back the token and user info
  res.json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role)
  })
})

// ────────────────────────────────────────────
// @route   POST /api/auth/login-company
// @desc    Login for companies
// @access  Public
// ────────────────────────────────────────────
const loginCompany = asyncHandler(async (req, res) => {

  const { email, password } = req.body

  // find the company by email
  const company = await Company.findOne({ email })

  if (!company) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
  }

  // check if company is approved by admin
  if (company.status === 'pending') {
    return res.status(403).json({ message: 'Votre compte est en attente de validation' })
  }

  if (company.status === 'rejected') {
    return res.status(403).json({ message: 'Votre inscription a été rejetée' })
  }

  if (company.status === 'blocked') {
    return res.status(403).json({ message: 'Votre compte a été bloqué' })
  }

  // check password
  const isMatch = await bcrypt.compare(password, company.password)

  if (!isMatch) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
  }

  // send back token with company role
  res.json({
    _id: company._id,
    name: company.name,
    email: company.email,
    role: 'company',
    token: generateToken(company._id, 'company')
  })
})

// ────────────────────────────────────────────
// @route   POST /api/auth/register-company
// @desc    Company creates an account (pending validation)
// @access  Public
// ────────────────────────────────────────────
const registerCompany = asyncHandler(async (req, res) => {

  const { name, email, password, sector, address, phone } = req.body

  // check if company email already exists
  const companyExists = await Company.findOne({ email })

  if (companyExists) {
    return res.status(400).json({ message: 'Cet email est déjà utilisé' })
  }

  // hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // create the company with status pending
  const company = await Company.create({
    name,
    email,
    password: hashedPassword,
    sector,
    address,
    phone,
    status: 'pending'
  })

  res.status(201).json({
    message: 'Inscription envoyée — en attente de validation par l administration',
    company: {
      _id: company._id,
      name: company.name,
      email: company.email,
      status: company.status
    }
  })
})

// ── register all routes ──
router.post('/seed-admin', seedAdmin)
router.post('/login', loginUser)
router.post('/login-company', loginCompany)
router.post('/register-company', registerCompany)

module.exports = router