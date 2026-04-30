import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const AdminOffers = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }

  const [offers, setOffers] = useState([])
  const [message, setMessage] = useState('')

  const fetchOffers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/offers/pending`, { headers })
    setOffers(res.data)
  }

  useEffect(() => { fetchOffers() }, [])

  const handleStatus = async (id, status) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/offers/${id}/status`, { status }, { headers })
    setMessage(status === 'published' ? 'Offre publiée ✓' : 'Offre rejetée')
    fetchOffers()
  }

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.pageTitle}>Modération des offres</div>
            <div style={styles.pageSub}>{offers.length} offres en attente</div>
          </div>
        </div>

        {message && <div style={styles.msg}>{message}</div>}

        <div style={styles.card}>
          {offers.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>✅</div>
              <div>Aucune offre en attente de modération</div>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Intitulé', 'Logo', 'Entreprise', 'Type', 'Niveau', 'Lieu', 'Actions'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {offers.map(o => (
                  <tr key={o._id}>
                    <td style={styles.td}><strong>{o.title}</strong></td>
                    <td style={styles.td}>
                      {o.company_id?.profilePicture ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${o.company_id.profilePicture}` }
                          alt={o.company_id.name}
                          style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={styles.logoFallback}>
                          {o.company_id?.name?.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>{o.company_id?.name}</td>
                    <td style={styles.td}>
                      <span style={o.type === 'stage' ? styles.badgeBlue : styles.badgePurple}>
                        {o.type}
                      </span>
                    </td>
                    <td style={styles.td}>{o.requiredLevel}</td>
                    <td style={styles.td}>{o.location}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={styles.btnSuccess} onClick={() => handleStatus(o._id, 'published')}
                          onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                          onMouseLeave={e => e.currentTarget.style.background = '#10b981'}>Publier</button>
                        <button style={styles.btnDanger} onClick={() => handleStatus(o._id, 'rejected')}
                          onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                          onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}>Rejeter</button>
                      </div>
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
  msg: { background: '#d1fae5', color: '#065f38', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  empty: { padding: '48px', textAlign: 'center', color: '#9aa5b4', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9aa5b4', background: '#f5f7fa', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '13px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#4a5568' },
  badgeBlue: { background: '#e8f0fd', color: '#1d6bdb', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  badgePurple: { background: '#f3e8ff', color: '#6b21a8', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  logoFallback: { width: '36px', height: '36px', borderRadius: '8px', background: '#e8f0fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#1d6bdb', fontSize: '14px' },
  btnSuccess: { padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.15s' },
  btnDanger: { padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.15s' },
}

export default AdminOffers