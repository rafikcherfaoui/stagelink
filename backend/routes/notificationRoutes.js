const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const Notification = require('../models/Notification')
const { protect, authorizeRoles } = require('../middleware/auth')

// ────────────────────────────────────────────
// @route   GET /api/notifications
// @desc    Student gets all their notifications
// @access  Private — student only
// ────────────────────────────────────────────
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ student_id: req.user.id })
    .sort({ createdAt: -1 })
  res.json(notifications)
})

// ────────────────────────────────────────────
// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private — student only
// ────────────────────────────────────────────
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { student_id: req.user.id, isRead: false },
    { isRead: true }
  )
  res.json({ message: 'Toutes les notifications marquées comme lues' })
})

// ────────────────────────────────────────────
// @route   PUT /api/notifications/:id/read
// @desc    Mark one notification as read
// @access  Private — student only
// ────────────────────────────────────────────
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id)

  if (!notification) {
    return res.status(404).json({ message: 'Notification non trouvée' })
  }

  if (notification.student_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé' })
  }

  notification.isRead = true
  await notification.save()

  res.json({ message: 'Notification marquée comme lue' })
})

// important: read-all must be before /:id to avoid route conflict
router.get('/', protect, authorizeRoles('student'), getNotifications)
router.put('/read-all', protect, authorizeRoles('student'), markAllAsRead)
router.put('/:id/read', protect, authorizeRoles('student'), markAsRead)

module.exports = router
