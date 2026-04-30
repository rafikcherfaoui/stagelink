import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const AdminCompanies = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }

  const [companies, setCompanies] = useState([])
  const [message, setMessage] = useState('')

  const fetchCompanies = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/companies`, { headers })
    setCompanies(res.data)
  }

  useEffect(() => { fetchCompanies() }, [])

  const handleStatus = async (id, status) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/companies/${id}/status`, { status }, { headers })
    setMessage(`Entreprise ${status === 'approved' ? 'approuvée' : status === 'rejected' ? 'rejetée' : 'bloquée'} ✓`)
    fetchCompanies()
  }

  const statusBadge = (status) => {
    const map = {
      pending: { bg: '#fef3cd', color: '#92400e', label: 'En attente' },
      approved: { bg: '#d1fae5', color: '#065f38', label: 'Approuvée' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejetée' },
      blocked: { bg: '#fee2e2', color: '#991b1b', label: 'Bloquée' },
    }
    const s = map[status]
    return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{s.label}</span>
  }

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.pageTitle}>Gestion des entreprises</div>
            <div style={styles.pageSub}>{companies.length} entreprises enregistrées</div>
          </div>
        </div>

        {message && <div style={styles.msg}>{message}</div>}

        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Entreprise', 'Email', 'Secteur', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.map(c => (
                <tr key={c._id}>
                  <td style={styles.td}><strong>{c.name}</strong></td>
                  <td style={styles.td}>{c.email}</td>
                  <td style={styles.td}>{c.sector}</td>
                  <td style={styles.td}>{statusBadge(c.status)}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {c.status === 'pending' && <>
                        <button style={styles.btnSuccess} onClick={() => handleStatus(c._id, 'approved')}
                          onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                          onMouseLeave={e => e.currentTarget.style.background = '#10b981'}>Approuver</button>
                        <button style={styles.btnDanger} onClick={() => handleStatus(c._id, 'rejected')}
                          onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                          onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}>Rejeter</button>
                      </>}
                      {c.status === 'approved' &&
                        <button style={styles.btnOutline} onClick={() => handleStatus(c._id, 'blocked')}
                          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Bloquer</button>
                      }
                      {c.status === 'blocked' &&
                        <button style={styles.btnSuccess} onClick={() => handleStatus(c._id, 'approved')}
                          onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                          onMouseLeave={e => e.currentTarget.style.background = '#10b981'}>Débloquer</button>
                      }
                    </div>
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
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9aa5b4', background: '#f5f7fa', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '13px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#4a5568' },
  btnSuccess: { padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.15s' },
  btnDanger: { padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.15s' },
  btnOutline: { padding: '6px 12px', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', color: '#4a5568', transition: 'background 0.15s' },
}

export default AdminCompanies