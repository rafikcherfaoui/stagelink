import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const AdminStudents = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }

  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ fullName: '', email: '', speciality: '', level: 'L3', phone: '' })
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [passwords, setPasswords] = useState({})

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/api/users?role=student', { headers })
    setStudents(res.data)
  }

  useEffect(() => { fetchStudents() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/users/create',
        { ...form, role: 'student' }, { headers })
      setGeneratedPassword(res.data.temporaryPassword)
      setMessage('')
      setForm({ fullName: '', email: '', speciality: '', level: 'L3', phone: '' })
      setShowForm(false)
      fetchStudents()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const handleBlock = async (id, isActive) => {
    await axios.put(`http://localhost:5000/api/users/${id}/block`, {}, { headers })
    setMessage(isActive ? 'Compte bloqué' : 'Compte débloqué')
    fetchStudents()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la désactivation ?')) return
    await axios.delete(`http://localhost:5000/api/users/${id}`, { headers })
    setMessage('Compte désactivé')
    fetchStudents()
  }

  const handleViewPassword = async (id) => {
    if (passwords[id] !== undefined) {
      setPasswords(prev => { const p = { ...prev }; delete p[id]; return p })
      return
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}/password`, { headers })
      setPasswords(prev => ({ ...prev, [id]: res.data.tempPassword || res.data.message }))
    } catch {
      setPasswords(prev => ({ ...prev, [id]: 'Erreur' }))
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.pageTitle}>Gestion des étudiants</div>
            <div style={styles.pageSub}>{students.length} étudiants inscrits</div>
          </div>
          <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}
            onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
            onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
            {showForm ? 'Annuler' : '+ Ajouter étudiant'}
          </button>
        </div>

        {message && <div style={styles.msg}>{message}</div>}

        {generatedPassword && (
          <div style={styles.passwordBox}>
            <div style={styles.passwordTitle}>
              🔑 Mot de passe temporaire généré — à remettre à l'étudiant :
            </div>
            <div style={styles.passwordValue}>{generatedPassword}</div>
            <div style={styles.passwordNote}>
              Notez-le et remettez-le à l'étudiant.
            </div>
            <button style={styles.btnOutline} onClick={() => setGeneratedPassword('')}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Fermer
            </button>
          </div>
        )}

        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.formTitle}>Créer un compte étudiant</div>
            <form onSubmit={handleCreate}>
              <div style={styles.formRow}>
                <div style={styles.group}>
                  <label style={styles.label}>Nom complet</label>
                  <input style={styles.input} value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    placeholder='Prénom Nom' required />
                </div>
                <div style={styles.group}>
                  <label style={styles.label}>Email universitaire</label>
                  <input style={styles.input} type='email' value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder='prenom.nom@univ-blida.dz' required />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.group}>
                  <label style={styles.label}>Spécialité</label>
                  <input style={styles.input} value={form.speciality}
                    onChange={e => setForm({ ...form, speciality: e.target.value })}
                    placeholder='Informatique' />
                </div>
                <div style={styles.group}>
                  <label style={styles.label}>Niveau</label>
                  <select style={styles.input} value={form.level}
                    onChange={e => setForm({ ...form, level: e.target.value })}>
                    <option>L2</option>
                    <option>L3</option>
                    <option>M1</option>
                    <option>M2</option>
                  </select>
                </div>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Téléphone (optionnel)</label>
                <input style={styles.input} value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder='+213 555 ...' />
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
                {['Nom', 'Email', 'Niveau', 'Spécialité', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td style={styles.td}><strong>{s.fullName}</strong></td>
                  <td style={styles.td}>{s.email}</td>
                  <td style={styles.td}>{s.level}</td>
                  <td style={styles.td}>{s.speciality}</td>
                  <td style={styles.td}>
                    <span style={s.isActive ? styles.badgeGreen : styles.badgeRed}>
                      {s.isActive ? 'Actif' : 'Bloqué'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button style={styles.btnWarning}
                        onClick={() => handleViewPassword(s._id)}
                        onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}>
                        {passwords[s._id] !== undefined ? 'Masquer' : 'Voir mot de passe'}
                      </button>
                      <button style={styles.btnOutline}
                        onClick={() => handleBlock(s._id, s.isActive)}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {s.isActive ? 'Bloquer' : 'Débloquer'}
                      </button>
                      <button style={styles.btnDanger}
                        onClick={() => handleDelete(s._id)}
                        onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                        onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}>
                        Supprimer
                      </button>
                    </div>
                    {passwords[s._id] !== undefined && (
                      <div style={styles.passwordInline}>
                        {passwords[s._id].startsWith("L'utilisateur") ? (
                          <span style={{ color: '#92400e', fontSize: '12px' }}>{passwords[s._id]}</span>
                        ) : (
                          <>
                            <span style={{ fontSize: '11px', color: '#92400e' }}>🔑 Mot de passe : </span>
                            <strong style={{ fontFamily: 'monospace', letterSpacing: '2px', color: '#0f1b2d', fontSize: '14px' }}>
                              {passwords[s._id]}
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

const styles = {
  page: { padding: '32px', fontFamily: 'sans-serif' },
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#0f1b2d', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#4a5568' },
  msg: { background: '#d1fae5', color: '#065f38', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  passwordBox: { background: '#fef3cd', border: '1.5px solid #f59e0b', borderRadius: '10px', padding: '20px', marginBottom: '20px' },
  passwordTitle: { fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '10px' },
  passwordValue: { fontSize: '28px', fontWeight: '800', color: '#0f1b2d', letterSpacing: '4px', marginBottom: '8px', fontFamily: 'monospace' },
  passwordNote: { fontSize: '12px', color: '#92400e', marginBottom: '12px' },
  passwordInline: { marginTop: '8px', background: '#fef3cd', border: '1px solid #f59e0b', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' },
  formCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '20px' },
  formTitle: { fontSize: '15px', fontWeight: '700', color: '#0f1b2d', marginBottom: '16px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  group: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box' },
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9aa5b4', background: '#f5f7fa', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '13px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#4a5568' },
  badgeGreen: { background: '#d1fae5', color: '#065f38', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  badgeRed: { background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  btnPrimary: { padding: '10px 20px', background: '#1d6bdb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' },
  btnWarning: { padding: '6px 12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.15s' },
  btnOutline: { padding: '6px 12px', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', color: '#4a5568', transition: 'background 0.15s' },
  btnDanger: { padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.15s' },
}

export default AdminStudents
