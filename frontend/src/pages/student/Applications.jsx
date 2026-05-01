import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const StudentApplications = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }
  const [applications, setApplications] = useState([])

  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showCompany, setShowCompany] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/my-applications`, { headers })
      setApplications(res.data)
    }
    fetch()
  }, [])

  const handleViewCompany = (company) => {
    setSelectedCompany(company)
    setShowCompany(true)
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
                  {['Offre', 'Entreprise', 'Type', 'Lieu', 'Date', 'Statut', 'Message'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map(a => (
                  <tr key={a._id}>
                    <td style={styles.td}><strong>{a.offer_id?.title}</strong></td>
                    <td style={styles.td}>
                      {a.offer_id?.company_id ? (
                        <span
                          style={styles.companyLink}
                          onClick={() => handleViewCompany(a.offer_id.company_id)}
                        >
                          {a.offer_id.company_id.name}
                        </span>
                      ) : (
                        <span style={{ color: '#9aa5b4' }}>—</span>
                      )}
                    </td>
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

              <div style={styles.divider} />
              <div style={{ textAlign: 'center' }}>
                <span style={styles.verifiedBadge}>Entreprise vérifiée ✓</span>
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
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  empty: { padding: '48px', textAlign: 'center', color: '#9aa5b4', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9aa5b4', background: '#f5f7fa', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '13px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#4a5568' },
  companyLink: { color: '#1d6bdb', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline dotted' },
  badgeBlue: { background: '#e8f0fd', color: '#1d6bdb', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  badgePurple: { background: '#f3e8ff', color: '#6b21a8', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  message: { fontStyle: 'italic', color: '#0ea5a0', fontSize: '12px' },
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
  verifiedBadge: { background: '#d1fae5', color: '#065f38', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
}

export default StudentApplications
