const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Company = require('../models/Company')
const crypto = require('crypto')
// crypto is built into Node.js — no need to install anything
// we use it to generate a secure random token
const { sendEmail } = require('../config/email')

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

// ────────────────────────────────────────────
// @route   POST /api/auth/forgot-password
// @desc    User enters their email to receive a reset link
// @access  Public
// ────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {

  const { email, userType } = req.body
  // userType = 'user' for student/teacher, 'company' for companies

  let account = null

  if (userType === 'company') {
    account = await Company.findOne({ email })
  } else {
    account = await User.findOne({ email })
  }

  // even if no account found we return the same message
  // this prevents attackers from knowing which emails exist in the database
  if (!account) {
    return res.json({
      message: 'Si cet email existe, un lien de réinitialisation vous a été envoyé.'
    })
  }

  // generate a random 64-character token using Node's crypto module
  const resetToken = crypto.randomBytes(32).toString('hex')

  // save the token and set expiry to 1 hour from now
  account.resetPasswordToken = resetToken
  account.resetPasswordExpires = Date.now() + 3600000 // 1 hour in milliseconds
  await account.save()

  // build the reset link — the frontend will handle this URL
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&type=${userType}`

  // build the email HTML
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e2e8f0;">
      <div style="background:#0f1b2d;padding:24px 32px;border-radius:12px 12px 0 0;">
        <div style="font-size:22px;font-weight:800;color:#fff;">Dahlab<span style="color:#0ea5a0;">Connect</span></div>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#0f1b2d;">Réinitialisation de votre mot de passe</h2>
        <p style="color:#4a5568;line-height:1.7;">Vous avez demandé une réinitialisation de votre mot de passe sur DahlabConnect.</p>
        <p style="color:#4a5568;line-height:1.7;">Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${resetLink}"
             style="background:#1d6bdb;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="color:#9aa5b4;font-size:13px;">Ce lien est valable pendant <strong>1 heure</strong> seulement.<br>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      </div>
      <div style="background:#f5f7fa;padding:16px 32px;text-align:center;font-size:12px;color:#9aa5b4;border-radius:0 0 12px 12px;">
        Université Saad Dahlab — Blida 1 · DahlabConnect
      </div>
    </div>
  `

  // send the email — fire and forget so the API responds immediately
  sendEmail({
    to: account.email,
    subject: 'Réinitialisation de votre mot de passe — DahlabConnect',
    html
  }).catch(err => console.log('Reset email failed:', err.message))

  res.json({
    message: 'Si cet email existe, un lien de réinitialisation vous a été envoyé.'
  })
})

// ────────────────────────────────────────────
// @route   POST /api/auth/reset-password
// @desc    User submits new password using the token from the email
// @access  Public
// ────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {

  const { token, newPassword, userType } = req.body

  let account = null

  if (userType === 'company') {
    // find the company that has this exact token AND it's not expired yet
    account = await Company.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
      // $gt = greater than — expiry must be in the future
    })
  } else {
    account = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })
  }

  // token not found or expired
  if (!account) {
    return res.status(400).json({
      message: 'Lien invalide ou expiré. Veuillez faire une nouvelle demande.'
    })
  }

  // hash the new password before saving
  const salt = await bcrypt.genSalt(10)
  account.password = await bcrypt.hash(newPassword, salt)

  // clear the token so it cannot be used again
  account.resetPasswordToken = null
  account.resetPasswordExpires = null

  // also clear tempPassword if it exists (students and teachers)
  if (account.tempPassword !== undefined) {
    account.tempPassword = ''
  }

  await account.save()

  res.json({
    message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
  })
})

// ── register all routes ──
router.post('/seed-admin', seedAdmin)
router.post('/login', loginUser)
router.post('/login-company', loginCompany)
router.post('/register-company', registerCompany)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router