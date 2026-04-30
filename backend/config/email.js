const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    })
  } catch (error) {
    console.error('Email sending failed:', error.message)
  }
}

const applicationAcceptedTemplate = (studentName, offerTitle, companyName, companyMessage) => `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;background:#f5f7fa;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#0f1b2d;padding:24px 32px;">
      <div style="font-size:22px;font-weight:800;color:#fff;">Dahlab<span style="color:#0ea5a0;">Connect</span></div>
    </div>
    <div style="padding:32px;">
      <div style="font-size:20px;font-weight:700;color:#065f38;margin-bottom:16px;">🎉 Félicitations, ${studentName} !</div>
      <p style="color:#4a5568;line-height:1.7;">Votre candidature pour le poste <strong>${offerTitle}</strong> chez <strong>${companyName}</strong> a été <span style="color:#10b981;font-weight:600;">acceptée</span>.</p>
      ${companyMessage ? `<div style="background:#f0fdf4;border-left:4px solid #10b981;padding:14px 18px;border-radius:0 8px 8px 0;margin:20px 0;"><p style="margin:0;color:#4a5568;font-style:italic;">"${companyMessage}"</p></div>` : ''}
      <p style="color:#4a5568;line-height:1.7;">Nous vous encourageons à prendre contact avec l'entreprise rapidement pour les prochaines étapes.</p>
    </div>
    <div style="background:#f5f7fa;padding:16px 32px;text-align:center;font-size:12px;color:#9aa5b4;">Université Saad Dahlab — Blida 1 · Plateforme DahlabConnect</div>
  </div>
</body></html>`

const applicationRejectedTemplate = (studentName, offerTitle, companyName, companyMessage) => `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;background:#f5f7fa;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#0f1b2d;padding:24px 32px;">
      <div style="font-size:22px;font-weight:800;color:#fff;">Dahlab<span style="color:#0ea5a0;">Connect</span></div>
    </div>
    <div style="padding:32px;">
      <div style="font-size:18px;font-weight:700;color:#0f1b2d;margin-bottom:16px;">Bonjour ${studentName},</div>
      <p style="color:#4a5568;line-height:1.7;">Nous avons le regret de vous informer que votre candidature pour le poste <strong>${offerTitle}</strong> chez <strong>${companyName}</strong> n'a pas été retenue cette fois.</p>
      ${companyMessage ? `<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px 18px;border-radius:0 8px 8px 0;margin:20px 0;"><p style="margin:0;color:#4a5568;font-style:italic;">"${companyMessage}"</p></div>` : ''}
      <p style="color:#4a5568;line-height:1.7;">Ne vous découragez pas — de nombreuses autres opportunités vous attendent sur DahlabConnect. Continuez à postuler !</p>
    </div>
    <div style="background:#f5f7fa;padding:16px 32px;text-align:center;font-size:12px;color:#9aa5b4;">Université Saad Dahlab — Blida 1 · Plateforme DahlabConnect</div>
  </div>
</body></html>`

const accountCreatedTemplate = (fullName, email, temporaryPassword, role) => {
  const roleLabel = role === 'student' ? 'étudiant(e)' : 'enseignant(e)'
  return `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;background:#f5f7fa;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#0f1b2d;padding:24px 32px;">
      <div style="font-size:22px;font-weight:800;color:#fff;">Dahlab<span style="color:#0ea5a0;">Connect</span></div>
    </div>
    <div style="padding:32px;">
      <div style="font-size:18px;font-weight:700;color:#0f1b2d;margin-bottom:16px;">Bienvenue, ${fullName} !</div>
      <p style="color:#4a5568;line-height:1.7;">Votre compte ${roleLabel} a été créé sur la plateforme DahlabConnect de l'Université Saad Dahlab Blida 1.</p>
      <div style="background:#f0f7ff;border:1.5px solid #1d6bdb;border-radius:10px;padding:20px;margin:20px 0;">
        <div style="font-size:13px;font-weight:600;color:#1d6bdb;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;">Vos identifiants</div>
        <div style="margin-bottom:8px;"><span style="color:#4a5568;font-size:13px;">Email : </span><strong style="color:#0f1b2d;">${email}</strong></div>
        <div><span style="color:#4a5568;font-size:13px;">Mot de passe temporaire : </span><strong style="color:#0f1b2d;font-family:monospace;font-size:18px;letter-spacing:3px;">${temporaryPassword}</strong></div>
      </div>
      <div style="background:#fef3cd;border:1px solid #f59e0b;border-radius:8px;padding:12px 16px;font-size:13px;color:#92400e;">⚠️ Changez votre mot de passe dès votre première connexion depuis votre profil.</div>
    </div>
    <div style="background:#f5f7fa;padding:16px 32px;text-align:center;font-size:12px;color:#9aa5b4;">Université Saad Dahlab — Blida 1 · Plateforme DahlabConnect</div>
  </div>
</body></html>`
}

module.exports = { sendEmail, applicationAcceptedTemplate, applicationRejectedTemplate, accountCreatedTemplate }
