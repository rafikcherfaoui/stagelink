import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const StudentApplications = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('http://localhost:5000/api/applications/my-applications', { headers })
      setApplications(res.data)
    }
    fetch()
  }, [])

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
          <div style={styles.pageTitle}>Mes candidatures</div>
          <div style={styles.pageSub}>{applications.length} candidature(s) envoyée(s)</div>
        </div>

        <div style={styles.card}>
          {applications.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📨</div>
              <div>Vous n'avez pas encore postulé à une offre</div>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Offre', 'Type', 'Lieu', 'Date', 'Statut', 'Message'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map(a => (
                  <tr key={a._id}>
                    <td style={styles.td}><strong>{a.offer_id?.title}</strong></td>
                    <td style={styles.td}>
                      <span style={a.offer_id?.type === 'stage' ? styles.badgeBlue : styles.badgePurple}>
                        {a.offer_id?.type}
                      </span>
                    </td>
                    <td style={styles.td}>{a.offer_id?.location}</td>
                    <td style={styles.td}>{new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td style={styles.td}>{statusBadge(a.status)}</td>
                    <td style={styles.td}>
                      {a.message ? (
                        <span style={styles.message}>"{a.message}"</span>
                      ) : (
                        <span style={{ color: '#9aa5b4' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '32px', fontFamily: 'sans-serif' },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#0f1b2d', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#4a5568' },
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  empty: { padding: '48px', textAlign: 'center', color: '#9aa5b4', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9aa5b4', background: '#f5f7fa', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '13px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#4a5568' },
  badgeBlue: { background: '#e8f0fd', color: '#1d6bdb', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  badgePurple: { background: '#f3e8ff', color: '#6b21a8', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  message: { fontStyle: 'italic', color: '#0ea5a0', fontSize: '12px' },
}

export default StudentApplications