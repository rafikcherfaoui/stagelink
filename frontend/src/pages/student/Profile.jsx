import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const StudentProfile = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }

  const [form, setForm] = useState({ fullName: '', phone: '', speciality: '', level: '', linkedin: '', github: '' })
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [letters, setLetters] = useState([])
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [reqMessage, setReqMessage] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [message, setMessage] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [pictureFile, setPictureFile] = useState(null)

  useEffect(() => {
    setForm({
      fullName: user.fullName || '',
      phone: user.phone || '',
      speciality: user.speciality || '',
      level: user.level || '',
      linkedin: user.linkedin || '',
      github: user.github || '',
    })
    const fetchMe = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, { headers })
      setProfilePicture(res.data.profilePicture || '')
    }
    const fetchLetters = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recommendations/my-letters`, { headers })
      setLetters(res.data)
    }
    const fetchTeachers = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recommendations/teachers`, { headers })
      setTeachers(res.data)
    }
    fetchMe()
    fetchLetters()
    fetchTeachers()
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, form, { headers })
      setMessage('Profil mis à jour ✓')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const handleUploadCV = async () => {
    if (!cvFile) return
    const formData = new FormData()
    formData.append('cv', cvFile)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/upload-cv`, formData, {
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
      })
      setMessage('CV uploadé avec succès ✓')
    } catch {
      setMessage("Erreur lors de l'upload")
    }
  }

  const handleUploadPicture = async () => {
    if (!pictureFile) return
    const formData = new FormData()
    formData.append('picture', pictureFile)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/upload-picture`, formData, {
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
      })
      setProfilePicture(res.data.profilePicture)
      setPictureFile(null)
      setMessage('Photo de profil mise à jour ✓')
    } catch {
      setMessage("Erreur lors de l'upload de la photo")
    }
  }

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirm) {
      setMessage('Les mots de passe ne correspondent pas')
      return
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/change-password`,
        { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
        { headers }
      )
      setMessage('Mot de passe modifié avec succès ✓')
      setPasswords({ oldPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const handleSendRequest = async () => {
    if (!selectedTeacher) return
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recommendations/request/${selectedTeacher}`,
        { message: reqMessage },
        { headers }
      )
      setMessage('Demande de recommandation envoyée ✓')
      setReqMessage('')
      setSelectedTeacher('')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const avatarUrl = profilePicture ? `${import.meta.env.VITE_API_URL}/${profilePicture}` : null
  const initials = form.fullName ? form.fullName.charAt(0).toUpperCase() : '?'

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageTitle}>Mon profil</div>

        {message && (
          <div style={message.includes('✓') ? styles.msgSuccess : styles.msgError}>
            {message}
          </div>
        )}

        

        <div style={styles.grid}>

          {/* profile form */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Informations personnelles</div>
            <form onSubmit={handleUpdateProfile}>
              <div style={styles.group}>
                <label style={styles.label}>Nom complet</label>
                <input style={styles.input} value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Téléphone</label>
                <input style={styles.input} value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder='+213 555 ...' />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>LinkedIn</label>
                <input style={styles.input} value={form.linkedin}
                  onChange={e => setForm({ ...form, linkedin: e.target.value })}
                  placeholder='https://linkedin.com/in/votre-profil' />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>GitHub</label>
                <input style={styles.input} value={form.github}
                  onChange={e => setForm({ ...form, github: e.target.value })}
                  placeholder='https://github.com/votre-username' />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Spécialité</label>
                <input style={styles.input} value={form.speciality}
                  onChange={e => setForm({ ...form, speciality: e.target.value })} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Niveau</label>
                <select style={styles.input} value={form.level}
                  onChange={e => setForm({ ...form, level: e.target.value })}>
                  <option value='L2'>L2</option>
                  <option value='L3'>L3</option>
                  <option value='M1'>M1</option>
                  <option value='M2'>M2</option>
                </select>
              </div>
              <button style={styles.btnPrimary} type='submit'
                onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
                onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>Sauvegarder</button>
            </form>
          </div>

          <div>
            {/* cv upload */}
            <div style={{ ...styles.card, marginBottom: '16px' }}>
              <div style={styles.cardTitle}>Mon CV</div>
              <div style={styles.uploadZone}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📄</div>
                <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '12px' }}>
                  Uploadez votre CV en format PDF (max 5MB)
                </div>
                <input type='file' accept='.pdf'
                  onChange={e => setCvFile(e.target.files[0])}
                  style={{ fontSize: '13px', marginBottom: '12px' }} />
                <br />
                <button style={styles.btnPrimary} onClick={handleUploadCV}
                  onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
                  Uploader le CV
                </button>
              </div>
            </div>

            {/* recommendation request */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>Demander une recommandation</div>
              <div style={styles.group}>
                <label style={styles.label}>Choisir un enseignant</label>
                <select style={styles.input} value={selectedTeacher}
                  onChange={e => setSelectedTeacher(e.target.value)}>
                  <option value=''>-- Sélectionner --</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>
                      {t.fullName} — {t.speciality}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Message (optionnel)</label>
                <textarea style={styles.textarea}
                  value={reqMessage}
                  onChange={e => setReqMessage(e.target.value)}
                  placeholder='Expliquez pourquoi vous demandez cette recommandation...'
                  rows={3} />
              </div>
              <button style={styles.btnTeal} onClick={handleSendRequest}
                onMouseEnter={e => e.currentTarget.style.background = '#0b918c'}
                onMouseLeave={e => e.currentTarget.style.background = '#0ea5a0'}>
                Envoyer la demande
              </button>
            </div>
          </div>
        </div>

        {/* recommendation letters received */}
        <div style={{ ...styles.card, marginTop: '20px' }}>
          <div style={styles.cardTitle}>Lettres de recommandation reçues</div>
          {letters.length === 0 ? (
            <div style={styles.empty}>Aucune lettre de recommandation reçue pour le moment</div>
          ) : (
            letters.map(l => (
              <div key={l._id} style={styles.letterCard}>
                <div style={styles.letterTeacher}>
                  {l.teacher_id?.fullName} · {l.teacher_id?.speciality}
                </div>
                <div style={styles.letterContent}>"{l.content}"</div>
                <div style={styles.letterDate}>
                  {new Date(l.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* change password */}
        <div style={{ ...styles.card, marginTop: '20px' }}>
          <div style={styles.cardTitle}>Modifier le mot de passe</div>
          <div style={styles.grid}>
            <div style={styles.group}>
              <label style={styles.label}>Ancien mot de passe</label>
              <input style={styles.input} type='password'
                value={passwords.oldPassword}
                onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                placeholder='••••••••' />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Nouveau mot de passe</label>
              <input style={styles.input} type='password'
                value={passwords.newPassword}
                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder='••••••••' />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Confirmer le mot de passe</label>
              <input style={styles.input} type='password'
                value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder='••••••••' />
            </div>
          </div>
          <button style={styles.btnPrimary} onClick={handleChangePassword}
            onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
            onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
            Modifier le mot de passe
          </button>
        </div>

      </div>
    </div>
  )
}

const styles = {
  page: { padding: '32px', fontFamily: 'sans-serif' },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#0f1b2d', marginBottom: '24px' },
  msgSuccess: { background: '#d1fae5', color: '#065f38', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  msgError: { background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  avatarSection: { display: 'flex', alignItems: 'center', gap: '20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px' },
  avatarWrap: { flexShrink: 0 },
  avatarImg: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', display: 'block' },
  avatarInitials: { width: '80px', height: '80px', borderRadius: '50%', background: '#1d6bdb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700' },
  avatarControls: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#0f1b2d', marginBottom: '16px' },
  group: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box', resize: 'vertical' },
  uploadZone: { border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '24px', textAlign: 'center' },
  btnPrimary: { padding: '10px 20px', background: '#1d6bdb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' },
  btnTeal: { padding: '10px 20px', background: '#0ea5a0', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' },
  empty: { color: '#9aa5b4', fontSize: '13px', textAlign: 'center', padding: '24px' },
  letterCard: { background: '#e6f7f7', borderRadius: '10px', padding: '16px', marginBottom: '12px' },
  letterTeacher: { fontWeight: '600', fontSize: '13px', color: '#065f60', marginBottom: '8px' },
  letterContent: { fontSize: '13px', color: '#4a5568', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '8px' },
  letterDate: { fontSize: '11px', color: '#9aa5b4' },
}

export default StudentProfile
