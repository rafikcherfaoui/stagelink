import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const TeacherRecommendations = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }
  const [letters, setLetters] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('http://localhost:5000/api/recommendations/sent', { headers })
      setLetters(res.data)
    }
    fetch()
  }, [])

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <div style={styles.pageTitle}>Mes lettres de recommandation</div>
          <div style={styles.pageSub}>{letters.length} lettre(s) rédigée(s)</div>
        </div>

        {letters.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>✍️</div>
            <div>Vous n'avez pas encore rédigé de lettre de recommandation</div>
          </div>
        ) : (
          letters.map(l => (
            <div key={l._id} style={styles.letterCard}>
              <div style={styles.letterHeader}>
                <div>
                  <div style={styles.letterStudent}>
                    Pour : {l.student_id?.fullName}
                  </div>
                  <div style={styles.letterMeta}>
                    {l.student_id?.level} · {l.student_id?.speciality} · {l.student_id?.email}
                  </div>
                </div>
                <div style={styles.letterDate}>
                  {new Date(l.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div style={styles.letterContent}>
                "{l.content}"
              </div>
            </div>
          ))
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
  empty: { textAlign: 'center', padding: '64px', color: '#9aa5b4', fontSize: '14px' },
  letterCard: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '16px' },
  letterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  letterStudent: { fontSize: '15px', fontWeight: '700', color: '#0f1b2d', marginBottom: '4px' },
  letterMeta: { fontSize: '12px', color: '#9aa5b4' },
  letterDate: { fontSize: '12px', color: '#9aa5b4' },
  letterContent: { fontSize: '13px', color: '#4a5568', fontStyle: 'italic', lineHeight: '1.7', background: '#e6f7f7', borderRadius: '8px', padding: '16px' },
}

export default TeacherRecommendations