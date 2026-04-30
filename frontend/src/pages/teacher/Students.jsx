import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const TeacherStudents = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }

  const [students, setStudents] = useState([])
  const [requests, setRequests] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/api/users?role=student', { headers })
    setStudents(res.data.filter(s => s.isActive))
  }

  const fetchRequests = async () => {
    const res = await axios.get('http://localhost:5000/api/recommendations/requests', { headers })
    setRequests(res.data)
  }

  useEffect(() => {
    fetchStudents()
    fetchRequests()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleWriteLetter = async (studentId, requestId) => {
    if (!content) {
      setMessage('Le contenu de la lettre est obligatoire')
      return
    }
    try {
      await axios.post(
        `http://localhost:5000/api/recommendations/write/${requestId}`,
        { content },
        { headers }
      )
      setMessage('Lettre de recommandation envoyée ✓')
      setSelectedStudent(null)
      setContent('')
      fetchRequests()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const handleIgnore = async (requestId) => {
    await axios.put(
      `http://localhost:5000/api/recommendations/request/${requestId}/ignore`,
      {},
      { headers }
    )
    setMessage('Demande ignorée')
    fetchRequests()
  }

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageTitle}>Étudiants et recommandations</div>

        {message && (
          <div style={message.includes('✓') ? styles.msgSuccess : styles.msgError}>
            {message}
          </div>
        )}

        {/* pending requests */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            Demandes de recommandation en attente
            {requests.length > 0 && (
              <span style={styles.badge}>{requests.length}</span>
            )}
          </div>
          {requests.length === 0 ? (
            <div style={styles.empty}>Aucune demande en attente</div>
          ) : (
            requests.map(r => (
              <div key={r._id} style={styles.requestCard}>
                <div style={styles.requestInfo}>
                  <div style={styles.requestName}>
                    {r.student_id?.fullName}
                  </div>
                  <div style={styles.requestMeta}>
                    {r.student_id?.level} · {r.student_id?.speciality}
                  </div>
                  {r.message && (
                    <div style={styles.requestMessage}>
                      "{r.message}"
                    </div>
                  )}
                </div>
                <div style={styles.requestActions}>
                  {r.student_id?.cvPath && (
                    <a
                      href={'http://localhost:5000/' + r.student_id.cvPath}
                      target='_blank'
                      rel='noreferrer'
                      style={styles.btnCV}
                      onMouseEnter={e => e.currentTarget.style.background = '#d0e4fc'}
                      onMouseLeave={e => e.currentTarget.style.background = '#e8f0fd'}
                    >
                      📄 CV
                    </a>
                  )}
                  <button style={styles.btnTeal}
                    onClick={() => setSelectedStudent(r)}
                    onMouseEnter={e => e.currentTarget.style.background = '#0b918c'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0ea5a0'}>
                    ✍️ Rédiger
                  </button>
                  <button style={styles.btnOutline}
                    onClick={() => handleIgnore(r._id)}
                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    Ignorer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* write letter modal */}
        {selectedStudent && (
          <div style={styles.modal}>
            <div style={styles.modalBox}>
              <div style={styles.modalTitle}>
                Lettre de recommandation pour {selectedStudent.student_id?.fullName}
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Contenu de la lettre</label>
                <textarea
                  style={styles.textarea}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Rédigez votre lettre de recommandation. Mettez en valeur les compétences, l'attitude et le sérieux de l'étudiant..."
                  rows={6}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={styles.btnTeal}
                  onClick={() => handleWriteLetter(
                    selectedStudent.student_id?._id,
                    selectedStudent._id
                  )}
                  onMouseEnter={e => e.currentTarget.style.background = '#0b918c'}
                  onMouseLeave={e => e.currentTarget.style.background = '#0ea5a0'}>
                  Envoyer la lettre ✓
                </button>
                <button style={styles.btnOutline}
                  onClick={() => { setSelectedStudent(null); setContent('') }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* all students list */}
        <div style={{ ...styles.card, marginTop: '20px' }}>
          <div style={styles.cardTitle}>Tous les étudiants</div>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Nom', 'Email', 'Niveau', 'Spécialité', 'CV'].map(h => (
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
                    {s.cvPath ? (
                      <a
                        href={'http://localhost:5000/' + s.cvPath}
                        target='_blank'
                        rel='noreferrer'
                        style={styles.btnCV}
                      >
                        📄 Voir CV
                      </a>
                    ) : (
                      <span style={{ color: '#9aa5b4', fontSize: '12px' }}>Non uploadé</span>
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
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#0f1b2d', marginBottom: '24px' },
  msgSuccess: { background: '#d1fae5', color: '#065f38', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  msgError: { background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#0f1b2d', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  badge: { background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  empty: { color: '#9aa5b4', fontSize: '13px', textAlign: 'center', padding: '24px' },
  requestCard: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px', background: '#f5f7fa', borderRadius: '10px', marginBottom: '12px' },
  requestInfo: { flex: 1 },
  requestName: { fontWeight: '600', fontSize: '14px', color: '#0f1b2d', marginBottom: '4px' },
  requestMeta: { fontSize: '12px', color: '#9aa5b4', marginBottom: '6px' },
  requestMessage: { fontSize: '12px', color: '#4a5568', fontStyle: 'italic' },
  requestActions: { display: 'flex', gap: '8px', alignItems: 'center' },
  group: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  textarea: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box', resize: 'vertical' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9aa5b4', background: '#f5f7fa', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '13px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#4a5568' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modalBox: { background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '540px' },
  modalTitle: { fontSize: '17px', fontWeight: '700', color: '#0f1b2d', marginBottom: '20px' },
  btnTeal: { padding: '8px 16px', background: '#0ea5a0', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' },
  btnOutline: { padding: '8px 16px', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: '#4a5568', transition: 'background 0.15s' },
  btnCV: { padding: '6px 12px', background: '#e8f0fd', color: '#1d6bdb', borderRadius: '7px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', transition: 'background 0.15s' },
}

export default TeacherStudents