import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { lightTheme, darkTheme } from '../../styles/theme'
import Navbar from '../../components/Navbar'

const AdminTeachers = () => {

  const { user } = useAuth()
  const { isDark } = useTheme()
  const theme = isDark ? darkTheme : lightTheme
  const headers = { Authorization: `Bearer ${user.token}` }

  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState({ fullName: '', email: '', speciality: '' })
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [passwords, setPasswords] = useState({})

  const fetchTeachers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users?role=teacher`, { headers })
    setTeachers(res.data)
  }

  useEffect(() => { fetchTeachers() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    // Client-side check before hitting the server
    if (!form.email.endsWith('@univ-blida.dz')) {
      setMessage('Email invalide — doit se terminer par @univ-blida.dz')
      return
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/create`,
        { ...form, role: 'teacher' }, { headers })
      setGeneratedPassword(res.data.temporaryPassword)
      setMessage('')
      setForm({ fullName: '', email: '', speciality: '' })
      setShowForm(false)
      fetchTeachers()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const handleBlock = async (id, isActive) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${id}/block`, {}, { headers })
    setMessage(isActive ? 'Compte bloqué' : 'Compte débloqué')
    fetchTeachers()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la désactivation ?')) return
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, { headers })
    setMessage('Compte désactivé')
    fetchTeachers()
  }

  const handleViewPassword = async (id) => {
    if (passwords[id] !== undefined) {
      setPasswords(prev => { const p = { ...prev }; delete p[id]; return p })
      return
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${id}/password`, { headers })
      setPasswords(prev => ({ ...prev, [id]: res.data.tempPassword || res.data.message }))
    } catch {
      setPasswords(prev => ({ ...prev, [id]: 'Erreur' }))
    }
  }

  const styles = {
    page: { padding: '32px', fontFamily: 'sans-serif', background: theme.bg, minHeight: '100vh' },
    pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
    pageTitle: { fontSize: '22px', fontWeight: '700', color: theme.text, marginBottom: '4px' },
    pageSub: { fontSize: '13px', color: theme.text2 },
    msg: { background: '#d1fae5', color: '#065f38', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
    msgError: { background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
    passwordBox: { background: '#fef3cd', border: '1.5px solid #f59e0b', borderRadius: '10px', padding: '20px', marginBottom: '20px' },
    passwordTitle: { fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '10px' },
    passwordValue: { fontSize: '28px', fontWeight: '800', color: '#0f1b2d', letterSpacing: '4px', marginBottom: '8px', fontFamily: 'monospace' },
    passwordNote: { fontSize: '12px', color: '#92400e', marginBottom: '12px' },
    passwordInline: { marginTop: '8px', background: '#fef3cd', border: '1px solid #f59e0b', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' },
    formCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', marginBottom: '20px' },
    formTitle: { fontSize: '15px', fontWeight: '700', color: theme.text, marginBottom: '16px' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
    group: { marginBottom: '14px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '600', color: theme.text2, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    hint: { fontSize: '11px', color: '#9aa5b4', fontStyle: 'italic', marginTop: '4px' },
    input: { width: '100%', padding: '10px 14px', border: `1.5px solid ${theme.border}`, borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box', background: theme.inputBg, color: theme.text },
    card: { background: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}`, overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9aa5b4', background: theme.tableBg, borderBottom: `1px solid ${theme.border}` },
    td: { padding: '13px 16px', borderBottom: `1px solid ${theme.border}`, fontSize: '13px', color: theme.text2 },
    badgeGreen: { background: '#d1fae5', color: '#065f38', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    badgeRed: { background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    btnPrimary: { padding: '10px 20px', background: '#1d6bdb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' },
    btnWarning: { padding: '6px 12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.15s' },
    btnOutline: { padding: '6px 12px', background: 'transparent', border: `1.5px solid ${theme.border}`, borderRadius: '7px', fontSize: '12px', cursor: 'pointer', color: theme.text2, transition: 'background 0.15s' },
    btnDanger: { padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.15s' },
  }

  const msgStyle = message.includes('@univ-blida') || message === 'Erreur' || message.includes('invalide')
    ? styles.msgError : styles.msg

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.pageTitle}>Gestion des enseignants</div>
            <div style={styles.pageSub}>{teachers.length} enseignants inscrits</div>
          </div>
          <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}
            onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
            onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
            {showForm ? 'Annuler' : '+ Ajouter enseignant'}
          </button>
        </div>

        {message && <div style={msgStyle}>{message}</div>}

        {generatedPassword && (
          <div style={styles.passwordBox}>
            <div style={styles.passwordTitle}>
              🔑 Mot de passe temporaire généré — à remettre à l'enseignant :
            </div>
            <div style={styles.passwordValue}>{generatedPassword}</div>
            <div style={styles.passwordNote}>Ce mot de passe ne sera plus affiché. Notez-le et remettez-le à l'enseignant.</div>
            <button style={styles.btnOutline} onClick={() => setGeneratedPassword('')}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e2f47' : '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Fermer
            </button>
          </div>
        )}

        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.formTitle}>Créer un compte enseignant</div>
            <form onSubmit={handleCreate}>
              <div style={styles.formRow}>
                <div style={styles.group}>
                  <label style={styles.label}>Nom complet</label>
                  <input style={styles.input} value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    placeholder='Dr. Prénom Nom' required />
                </div>
                <div style={styles.group}>
                  <label style={styles.label}>Email universitaire</label>
                  <input style={styles.input} type='email' value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder='prenom.nom@univ-blida.dz' required />
                  <div style={styles.hint}>Format requis : @univ-blida.dz</div>
                </div>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Spécialité</label>
                <input style={styles.input} value={form.speciality}
                  onChange={e => setForm({ ...form, speciality: e.target.value })}
                  placeholder='Génie Logiciel' />
              </div>
              <button style={styles.btnPrimary} type='submit'
                onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
                onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
                Créer le compte →
              </button>
            </form>
          </div>
        )}

        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Nom', 'Email', 'Spécialité', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t._id}>
                  <td style={styles.td}><strong style={{ color: theme.text }}>{t.fullName}</strong></td>
                  <td style={styles.td}>{t.email}</td>
                  <td style={styles.td}>{t.speciality}</td>
                  <td style={styles.td}>
                    <span style={t.isActive ? styles.badgeGreen : styles.badgeRed}>
                      {t.isActive ? 'Actif' : 'Bloqué'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button style={styles.btnWarning}
                        onClick={() => handleViewPassword(t._id)}
                        onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}>
                        {passwords[t._id] !== undefined ? 'Masquer' : 'Voir mot de passe'}
                      </button>
                      <button style={styles.btnOutline}
                        onClick={() => handleBlock(t._id, t.isActive)}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e2f47' : '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {t.isActive ? 'Bloquer' : 'Débloquer'}
                      </button>
                      <button style={styles.btnDanger}
                        onClick={() => handleDelete(t._id)}
                        onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                        onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}>
                        Supprimer
                      </button>
                    </div>
                    {passwords[t._id] !== undefined && (
                      <div style={styles.passwordInline}>
                        {passwords[t._id].startsWith("L'utilisateur") ? (
                          <span style={{ color: '#92400e', fontSize: '12px' }}>{passwords[t._id]}</span>
                        ) : (
                          <>
                            <span style={{ fontSize: '11px', color: '#92400e' }}>🔑 Mot de passe : </span>
                            <strong style={{ fontFamily: 'monospace', letterSpacing: '2px', color: '#0f1b2d', fontSize: '14px' }}>
                              {passwords[t._id]}
                            </strong>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminTeachers
