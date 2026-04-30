import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const StudentOffers = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }

  const [offers, setOffers] = useState([])
  const [message, setMessage] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterLevel, setFilterLevel] = useState('')

  const fetchOffers = async () => {
    let url = `${import.meta.env.VITE_API_URL}/api/offers`
    const params = []
    if (filterType) params.push(`type=${filterType}`)
    if (filterLevel) params.push(`requiredLevel=${filterLevel}`)
    if (params.length) url += '?' + params.join('&')
    const res = await axios.get(url, { headers })
    setOffers(res.data)
  }

  useEffect(() => { fetchOffers() }, [filterType, filterLevel])

  const handleApply = async (offer_id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/${offer_id}`, {}, { headers })
      setMessage('Candidature envoyée avec succès ✓')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <div style={styles.pageTitle}>Offres disponibles</div>
          <div style={styles.pageSub}>{offers.length} offres publiées</div>
        </div>

        {message && (
          <div style={message.includes('✓') ? styles.msgSuccess : styles.msgError}>
            {message}
          </div>
        )}

        {/* filters */}
        <div style={styles.filters}>
          <select style={styles.select} value={filterType}
            onChange={e => setFilterType(e.target.value)}>
            <option value=''>Tous les types</option>
            <option value='stage'>Stage</option>
            <option value='emploi'>Emploi</option>
          </select>
          <select style={styles.select} value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}>
            <option value=''>Tous les niveaux</option>
            <option value='L2'>L2</option>
            <option value='L3'>L3</option>
            <option value='M1'>M1</option>
            <option value='M2'>M2</option>
            <option value='tout'>Tout niveau</option>
          </select>
        </div>

        {/* offers grid */}
        <div style={styles.grid}>
          {offers.map(offer => (
            <div key={offer._id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <div style={styles.company}>{offer.company_id?.name}</div>
                  <div style={styles.offerTitle}>{offer.title}</div>
                </div>
                {offer.company_id?.profilePicture ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${offer.company_id.profilePicture}` }
                    alt={offer.company_id.name}
                    style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={styles.companyLogo}>
                    {offer.company_id?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div style={styles.tags}>
                <span style={styles.tag}>📍 {offer.location}</span>
                <span style={styles.tag}>⏱ {offer.duration}</span>
                <span style={styles.tag}>🎓 {offer.requiredLevel}</span>
              </div>
              <div style={styles.desc}>{offer.description}</div>
              <div style={styles.cardBottom}>
                <span style={offer.type === 'stage' ? styles.badgeBlue : styles.badgePurple}>
                  {offer.type}
                </span>
                <button style={styles.btnApply} onClick={() => handleApply(offer._id)}
                  onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
                  Postuler →
                </button>
              </div>
            </div>
          ))}
        </div>

        {offers.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
            <div>Aucune offre disponible pour le moment</div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '32px', fontFamily: 'sans-serif' },
  pageHeader: { marginBottom: '20px' },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#0f1b2d', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#4a5568' },
  msgSuccess: { background: '#d1fae5', color: '#065f38', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  msgError: { background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  filters: { display: 'flex', gap: '12px', marginBottom: '24px' },
  select: { padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontFamily: 'sans-serif', color: '#0f1b2d', background: '#fff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  company: { fontSize: '12px', color: '#9aa5b4', marginBottom: '4px' },
  offerTitle: { fontSize: '16px', fontWeight: '700', color: '#0f1b2d' },
  companyLogo: { width: '42px', height: '42px', borderRadius: '10px', background: '#e8f0fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#1d6bdb', fontSize: '16px' },
  tags: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' },
  tag: { fontSize: '11px', color: '#9aa5b4' },
  desc: { fontSize: '12px', color: '#4a5568', lineHeight: '1.6', marginBottom: '16px' },
  cardBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  badgeBlue: { background: '#e8f0fd', color: '#1d6bdb', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  badgePurple: { background: '#f3e8ff', color: '#6b21a8', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  btnApply: { padding: '8px 16px', background: '#1d6bdb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' },
  empty: { textAlign: 'center', padding: '48px', color: '#9aa5b4', fontSize: '14px' },
}

export default StudentOffers