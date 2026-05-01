import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const CompanyCandidates = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }
  const { offer_id } = useParams()

  const [applications, setApplications] = useState([])
  const [message, setMessage] = useState('')
  const [rejectMsg, setRejectMsg] = useState('')
  const [acceptMsg, setAcceptMsg] = useState('')
  const [selected, setSelected] = useState(null)
  const [action, setAction] = useState('')

  const [letters, setLetters] = useState([])
  const [lettersStudent, setLettersStudent] = useState('')
  const [showLetters, setShowLetters] = useState(false)

  const fetchApplications = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/applications/offer/${offer_id}`,
      { headers }
    )
    setApplications(res.data)
  }

  useEffect(() => { fetchApplications() }, [])

  const fetchLetters = async (studentId, studentName) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/recommendations/student/` + studentId,
      { headers }
    )
    setLetters(res.data)
    setLettersStudent(studentName)
    setShowLetters(true)
  }

  const handleUpdateStatus = async (id, status, msg) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}/status`,
        { status, message: msg },
        { headers }
      )
      setMessage(status === 'accepted' ? 'Candidature acceptée ✓' : 'Candidature refusée')
      setSelected(null)
      setAcceptMsg('')
      setRejectMsg('')
      fetchApplications()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const statusBadge = (status) => {
    const map = {
      pending: { bg: '#fef3cd', color: '#92400e', label: 'En attente' },
      accepted: { bg: '#d1fae5', color: '#065f38', label: 'Acceptée ✓' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Refusée' },
    }
    const s = map[status]
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
        {s.label}
      </span>
    )
  }

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <div style={styles.pageTitle}>Candidatures reçues</div>
          <div style={styles.pageSub}>{applications.length} candidat(s)</div>
        </div>

        {message && (
          <div style={message.includes('✓') ? styles.msgSuccess : styles.msgError}>
            {message}
          </div>
        )}

        {applications.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>👥</div>
            <div>Aucune candidature reçue pour cette offre</div>
          </div>
        ) : (
          applications.map(a => (
            <div key={a._id} style={styles.candidateCard}>
              <div style={styles.candidateInfo}>
                <div style={styles.candidateName}>{a.student_id?.fullName}</div>
                <div style={styles.candidateMeta}>
                  {a.student_id?.level} · {a.student_id?.speciality} · {a.student_id?.email}
                </div>
                <div style={styles.candidateDate}>
                  Postulé le {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                </div>
                {a.message && (
                  <div style={styles.candidateMessage}>
                    Message : "{a.message}"
                  </div>
                )}
              </div>

              <div style={styles.candidateRight}>
                {statusBadge(a.status)}
                <div style={styles.candidateActions}>
                  {a.student_id?.cvPath && (
                    <a
                      href={a.student_id.cvPath}
                      target='_blank'
                      rel='noreferrer'
                      style={styles.btnCV}
                      onMouseEnter={e => e.currentTarget.style.background = '#d0e4fc'}
                      onMouseLeave={e => e.currentTarget.style.background = '#e8f0fd'}
                    >
                      📄 CV
                    </a>
                  )}

                  <button
                    style={styles.btnLetters}
                    onClick={() => fetchLetters(a.student_id._id, a.student_id.fullName)}
                    onMouseEnter={e => e.currentTarget.style.background = '#d0e4fc'}
                    onMouseLeave={e => e.currentTarget.style.background = '#e8f0fd'}
                    title='Lettres de recommandation'
                  >
                    📝
                  </button>

                  {a.student_id?.linkedin && (
                    <a
                      href={a.student_id.linkedin}
                      target='_blank'
                      rel='noreferrer'
                      style={styles.btnLinkedIn}
                      title='LinkedIn'
                    >
                      in
                    </a>
                  )}

                  {a.student_id?.github && (
                    <a
                      href={a.student_id.github}
                      target='_blank'
                      rel='noreferrer'
                      style={styles.btnGitHub}
                      title='GitHub'
                    >
                      GH
                    </a>
                  )}

                  {a.status === 'pending' && (
                    <>
                      <button style={styles.btnSuccess}
                        onClick={() => { setSelected(a); setAction('accept') }}
                        onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                        onMouseLeave={e => e.currentTarget.style.background = '#10b981'}>
                        Accepter
                      </button>
                      <button style={styles.btnDanger}
                        onClick={() => { setSelected(a); setAction('reject') }}
                        onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                        onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}>
                        Refuser
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* action modal */}
        {selected && (
          <div style={styles.modal}>
            <div style={styles.modalBox}>
              <div style={styles.modalTitle}>
                {action === 'accept' ? '✅ Accepter' : '❌ Refuser'} — {selected.student_id?.fullName}
              </div>
              <div style={styles.group}>
                <label style={styles.label}>
                  Message pour l'étudiant (optionnel)
                </label>
                <textarea
                  style={styles.textarea}
                  value={action === 'accept' ? acceptMsg : rejectMsg}
                  onChange={e => action === 'accept'
                    ? setAcceptMsg(e.target.value)
                    : setRejectMsg(e.target.value)
                  }
                  placeholder={action === 'accept'
                    ? 'Ex: Votre profil correspond parfaitement à notre offre...'
                    : 'Ex: Nous avons retenu un autre candidat...'
                  }
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={action === 'accept' ? styles.btnSuccess : styles.btnDanger}
                  onClick={() => handleUpdateStatus(
                    selected._id,
                    action === 'accept' ? 'accepted' : 'rejected',
                    action === 'accept' ? acceptMsg : rejectMsg
                  )}
                  onMouseEnter={e => e.currentTarget.style.background = action === 'accept' ? '#059669' : '#dc2626'}
                  onMouseLeave={e => e.currentTarget.style.background = action === 'accept' ? '#10b981' : '#ef4444'}>
                  Confirmer
                </button>
                <button style={styles.btnOutline}
                  onClick={() => { setSelected(null); setAcceptMsg(''); setRejectMsg('') }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* letters modal */}
        {showLetters && (
          <div style={styles.modal}>
            <div style={{ ...styles.modalBox, maxWidth: '560px' }}>
              <div style={styles.modalTitle}>
                📝 Lettres de recommandation — {lettersStudent}
              </div>
              {letters.length === 0 ? (
                <div style={styles.noLetters}>Aucune lettre de recommandation</div>
              ) : (
                letters.map(l => (
                  <div key={l._id} style={styles.letterCard}>
                    <div style={styles.letterTeacher}>
                      {l.teacher_id?.fullName}
                      {l.teacher_id?.speciality ? ` · ${l.teacher_id.speciality}` : ''}
                    </div>
                    <div style={styles.letterContent}>"{l.content}"</div>
                    <div style={styles.letterDate}>
                      {new Date(l.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                ))
              )}
              <div style={{ marginTop: '20px' }}>
                <button style={styles.btnOutline}
                  onClick={() => setShowLetters(false)}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '32px', fontFamily: 'sans-serif' },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#0f1b2d', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#4a5568' },
  msgSuccess: { background: '#d1fae5', color: '#065f38', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  msgError: { background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '64px', color: '#9aa5b4', fontSize: '14px' },
  candidateCard: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  candidateInfo: { flex: 1 },
  candidateName: { fontSize: '15px', fontWeight: '700', color: '#0f1b2d', marginBottom: '4px' },
  candidateMeta: { fontSize: '12px', color: '#9aa5b4', marginBottom: '4px' },
  candidateDate: { fontSize: '12px', color: '#9aa5b4', marginBottom: '6px' },
  candidateMessage: { fontSize: '12px', color: '#4a5568', fontStyle: 'italic', marginTop: '6px' },
  candidateRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' },
  candidateActions: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' },
  btnCV: { padding: '6px 12px', background: '#e8f0fd', color: '#1d6bdb', borderRadius: '7px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', transition: 'background 0.15s' },
  btnLetters: { padding: '6px 10px', background: '#e8f0fd', color: '#1d6bdb', border: 'none', borderRadius: '7px', fontSize: '14px', cursor: 'pointer', transition: 'background 0.15s' },
  btnLinkedIn: { width: '28px', height: '28px', background: '#0077b5', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', textDecoration: 'none' },
  btnGitHub: { width: '28px', height: '28px', background: '#24292e', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', textDecoration: 'none' },
  btnSuccess: { padding: '7px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.15s' },
  btnDanger: { padding: '7px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.15s' },
  btnOutline: { padding: '7px 14px', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', color: '#4a5568', transition: 'background 0.15s' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modalBox: { background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px' },
  modalTitle: { fontSize: '17px', fontWeight: '700', color: '#0f1b2d', marginBottom: '20px' },
  group: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  textarea: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box', resize: 'vertical' },
  noLetters: { color: '#9aa5b4', fontSize: '13px', textAlign: 'center', padding: '24px' },
  letterCard: { background: '#e6f7f7', borderRadius: '10px', padding: '16px', marginBottom: '12px' },
  letterTeacher: { fontWeight: '600', fontSize: '13px', color: '#065f60', marginBottom: '8px' },
  letterContent: { fontSize: '13px', color: '#4a5568', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '6px' },
  letterDate: { fontSize: '11px', color: '#9aa5b4' },
}

export default CompanyCandidates
