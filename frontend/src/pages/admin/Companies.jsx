import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const AdminCompanies = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }

  const [companies, setCompanies] = useState([])
  const [message, setMessage] = useState('')

  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showCompany, setShowCompany] = useState(false)

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

  const handleViewCompany = (company) => {
    setSelectedCompany(company)
    setShowCompany(true)
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
                  <td style={styles.td}>
                    <span style={styles.companyLink} onClick={() => handleViewCompany(c)}>
                      <strong>{c.name}</strong>
                    </span>
                  </td>
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

        {/* company profile modal */}
        {showCompany && selectedCompany && (
          <div style={styles.overlay} onClick={() => setShowCompany(false)}>
            <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
              <button style={styles.closeBtn} onClick={() => setShowCompany(false)}>✕</button>

              <div style={styles.companyHeader}>
                {selectedCompany.profilePicture ? (
                  <img
                    src={selectedCompany.profilePicture}
                    alt={selectedCompany.name}
                    style={styles.companyAvatar}
                  />
                ) : (
                  <div style={styles.companyAvatarFallback}>
                    {selectedCompany.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={styles.companyModalName}>{selectedCompany.name}</div>
                  {selectedCompany.sector && (
                    <span style={styles.sectorBadge}>{selectedCompany.sector}</span>
                  )}
                </div>
              </div>

              <div style={styles.divider} />

              <div style={styles.infoSection}>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>✉️ Email</div>
                  <div style={styles.infoValue}>{selectedCompany.email}</div>
                </div>
                {selectedCompany.address && (
                  <div style={styles.infoRow}>
                    <div style={styles.infoLabel}>📍 Adresse</div>
                    <div style={styles.infoValue}>{selectedCompany.address}</div>
                  </div>
                )}
                {selectedCompany.phone && (
                  <div style={styles.infoRow}>
                    <div style={styles.infoLabel}>📞 Téléphone</div>
                    <div style={styles.infoValue}>{selectedCompany.phone}</div>
                  </div>
                )}
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>🏭 Secteur</div>
                  <div style={styles.infoValue}>{selectedCompany.sector || '—'}</div>
                </div>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>📋 Statut</div>
                  <div style={styles.infoValue}>{statusBadge(selectedCompany.status)}</div>
                </div>
                {selectedCompany.description && (
                  <div style={styles.infoRow}>
                    <div style={styles.infoLabel}>📝 Description</div>
                    <div style={{ ...styles.infoValue, fontStyle: 'italic' }}>
                      {selectedCompany.description}
                    </div>
                  </div>
                )}
              </div>

              {(selectedCompany.website || selectedCompany.linkedin) && (
                <>
                  <div style={styles.divider} />
                  <div style={styles.linksRow}>
                    {selectedCompany.website && (
                      <a href={selectedCompany.website} target='_blank' rel='noreferrer'
                        style={styles.btnWebsite}>
                        🌐 Site web
                      </a>
                    )}
                    {selectedCompany.linkedin && (
                      <a href={selectedCompany.linkedin} target='_blank' rel='noreferrer'
                        style={styles.btnLinkedIn}>
                        in
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
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
  companyLink: { color: '#1d6bdb', cursor: 'pointer', textDecoration: 'underline dotted' },
  btnSuccess: { padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.15s' },
  btnDanger: { padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.15s' },
  btnOutline: { padding: '6px 12px', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', color: '#4a5568', transition: 'background 0.15s' },
  // modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 },
  modalBox: { background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto', margin: '0 16px' },
  closeBtn: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#9aa5b4', lineHeight: 1 },
  companyHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' },
  companyAvatar: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', flexShrink: 0 },
  companyAvatarFallback: { width: '80px', height: '80px', borderRadius: '50%', background: '#1d6bdb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', flexShrink: 0 },
  companyModalName: { fontSize: '20px', fontWeight: '700', color: '#0f1b2d', marginBottom: '6px' },
  sectorBadge: { background: '#e8f0fd', color: '#1d6bdb', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  divider: { height: '1px', background: '#e2e8f0', margin: '16px 0' },
  infoSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoRow: {},
  infoLabel: { fontSize: '11px', fontWeight: '600', color: '#9aa5b4', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' },
  infoValue: { fontSize: '14px', color: '#0f1b2d', lineHeight: '1.5' },
  linksRow: { display: 'flex', gap: '10px', alignItems: 'center' },
  btnWebsite: { padding: '8px 16px', background: '#f5f7fa', color: '#0f1b2d', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', border: '1px solid #e2e8f0' },
  btnLinkedIn: { width: '36px', height: '36px', background: '#0077b5', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', textDecoration: 'none' },
}

export default AdminCompanies
