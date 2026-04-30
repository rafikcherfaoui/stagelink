import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const CompanyMyOffers = () => {

  const { user } = useAuth()
  const headers = { Authorization: `Bearer ${user.token}` }
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    name: '', sector: '', address: '', phone: '', website: '', linkedin: '', description: '', profilePicture: ''
  })
  const [profileMsg, setProfileMsg] = useState('')

  const [offers, setOffers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    title: '', type: 'stage', description: '',
    requiredLevel: 'L3', duration: '', location: ''
  })

  const fetchProfile = async () => {
    const res = await axios.get('http://localhost:5000/api/companies/profile', { headers })
    setProfile(res.data)
  }

  const fetchOffers = async () => {
    const res = await axios.get('http://localhost:5000/api/offers/my-offers', { headers })
    setOffers(res.data)
  }

  useEffect(() => {
    fetchProfile()
    fetchOffers()
  }, [])

  const handleSaveProfile = async () => {
    try {
      const { name, sector, address, phone, website, linkedin, description } = profile
      await axios.put('http://localhost:5000/api/companies/profile',
        { name, sector, address, phone, website, linkedin, description },
        { headers }
      )
      setProfileMsg('Profil mis à jour ✓')
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Erreur')
    }
  }

  const handleUploadPicture = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('picture', file)
    try {
      const res = await axios.post('http://localhost:5000/api/companies/upload-picture', formData, {
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
      })
      setProfile(prev => ({ ...prev, profilePicture: res.data.profilePicture }))
      setProfileMsg('Photo mise à jour ✓')
    } catch {
      setProfileMsg("Erreur lors de l'upload de la photo")
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/offers', form, { headers })
      setMessage('Offre soumise — en attente de validation ✓')
      setForm({ title: '', type: 'stage', description: '', requiredLevel: 'L3', duration: '', location: '' })
      setShowForm(false)
      fetchOffers()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette offre ?')) return
    await axios.delete(`http://localhost:5000/api/offers/${id}`, { headers })
    setMessage('Offre supprimée')
    fetchOffers()
  }

  const statusBadge = (status) => {
    const map = {
      pending: { bg: '#fef3cd', color: '#92400e', label: 'En attente' },
      published: { bg: '#d1fae5', color: '#065f38', label: 'Publiée' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejetée' },
    }
    const s = map[status]
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
        {s.label}
      </span>
    )
  }

  const initials = profile.name ? profile.name.charAt(0).toUpperCase() : '?'
  const avatarUrl = profile.profilePicture ? `http://localhost:5000/${profile.profilePicture}` : null

  return (
    <div>
      <Navbar />
      <div style={styles.page}>

        {/* Company profile card */}
        <div style={styles.profileCard}>
          <div style={styles.cardTitle}>Profil de l'entreprise</div>

          <div style={styles.profileTop}>
            <div style={styles.avatarWrap}>
              {avatarUrl ? (
                <img src={avatarUrl} alt='logo' style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarInitials}>{initials}</div>
              )}
              <label style={styles.avatarEditBtn} title='Changer la photo'>
                ✏️
                <input type='file' accept='image/jpeg,image/png' style={{ display: 'none' }}
                  onChange={handleUploadPicture} />
              </label>
            </div>
            <div>
              <div style={styles.profileName}>{profile.name || "Nom de l'entreprise"}</div>
              <div style={styles.profileSector}>{profile.sector || ''}</div>
            </div>
          </div>

          {profileMsg && (
            <div style={profileMsg.includes('✓') ? styles.msgSuccess : styles.msgError}>
              {profileMsg}
            </div>
          )}

          <div style={styles.profileGrid}>
            <div style={styles.group}>
              <label style={styles.label}>Nom de l'entreprise</label>
              <input style={styles.input} value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Secteur d'activité</label>
              <input style={styles.input} value={profile.sector}
                onChange={e => setProfile({ ...profile, sector: e.target.value })}
                placeholder="Informatique, Finance..." />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Adresse</label>
              <input style={styles.input} value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                placeholder='Blida, Algérie' />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Téléphone</label>
              <input style={styles.input} value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                placeholder='+213 ...' />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Site web</label>
              <input style={styles.input} value={profile.website}
                onChange={e => setProfile({ ...profile, website: e.target.value })}
                placeholder='https://...' />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>LinkedIn</label>
              <input style={styles.input} value={profile.linkedin}
                onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder='https://linkedin.com/company/...' />
            </div>
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea}
              value={profile.description}
              onChange={e => setProfile({ ...profile, description: e.target.value })}
              placeholder='Décrivez votre entreprise...'
              rows={3} />
          </div>
          <button style={styles.btnPrimary} onClick={handleSaveProfile}
            onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
            onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
            Sauvegarder le profil
          </button>
        </div>

        {/* Offers section */}
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.pageTitle}>Mes offres</div>
            <div style={styles.pageSub}>{offers.length} offre(s)</div>
          </div>
          <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}
            onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
            onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
            {showForm ? 'Annuler' : '+ Publier une offre'}
          </button>
        </div>

        {message && (
          <div style={message.includes('✓') ? styles.msgSuccess : styles.msgError}>
            {message}
          </div>
        )}

        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.formTitle}>Nouvelle offre</div>
            <form onSubmit={handleCreate}>
              <div style={styles.formRow}>
                <div style={styles.group}>
                  <label style={styles.label}>Intitulé du poste</label>
                  <input style={styles.input} value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder='Développeur Web Full Stack' required />
                </div>
                <div style={styles.group}>
                  <label style={styles.label}>Type</label>
                  <select style={styles.input} value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value='stage'>Stage</option>
                    <option value='emploi'>Emploi</option>
                  </select>
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.group}>
                  <label style={styles.label}>Niveau requis</label>
                  <select style={styles.input} value={form.requiredLevel}
                    onChange={e => setForm({ ...form, requiredLevel: e.target.value })}>
                    <option value='L2'>L2</option>
                    <option value='L3'>L3</option>
                    <option value='M1'>M1</option>
                    <option value='M2'>M2</option>
                    <option value='tout'>Tout niveau</option>
                  </select>
                </div>
                <div style={styles.group}>
                  <label style={styles.label}>Durée / Contrat</label>
                  <input style={styles.input} value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder='3 mois / CDI / CDD' />
                </div>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Lieu</label>
                <input style={styles.input} value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder='Alger, Blida...' />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Description</label>
                <textarea style={styles.textarea}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder='Décrivez le poste, les missions et les compétences requises...'
                  rows={4} required />
              </div>
              <div style={styles.note}>
                ⚠️ Votre offre sera soumise à validation par l'administration avant publication.
              </div>
              <button style={styles.btnPrimary} type='submit'
                onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
                onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>Soumettre l'offre →</button>
            </form>
          </div>
        )}

        <div style={styles.card}>
          {offers.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
              <div>Vous n'avez pas encore publié d'offre</div>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Intitulé', 'Type', 'Niveau', 'Lieu', 'Candidatures', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {offers.map(o => (
                  <tr key={o._id}>
                    <td style={styles.td}><strong>{o.title}</strong></td>
                    <td style={styles.td}>
                      <span style={o.type === 'stage' ? styles.badgeBlue : styles.badgePurple}>
                        {o.type}
                      </span>
                    </td>
                    <td style={styles.td}>{o.requiredLevel}</td>
                    <td style={styles.td}>{o.location}</td>
                    <td style={styles.td}>
                      {o.status === 'published' ? (
                        <button style={styles.btnLink}
                          onClick={() => navigate(`/company/candidates/${o._id}`)}
                          onMouseEnter={e => e.currentTarget.style.color = '#1454b6'}
                          onMouseLeave={e => e.currentTarget.style.color = '#1d6bdb'}>
                          Voir candidats →
                        </button>
                      ) : '—'}
                    </td>
                    <td style={styles.td}>{statusBadge(o.status)}</td>
                    <td style={styles.td}>
                      <button style={styles.btnDanger}
                        onClick={() => handleDelete(o._id)}
                        onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                        onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}>
                        Supprimer
                      </button>
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
  profileCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#0f1b2d', marginBottom: '16px' },
  profileTop: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatarImg: { width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', display: 'block' },
  avatarInitials: { width: '72px', height: '72px', borderRadius: '50%', background: '#1d6bdb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700' },
  avatarEditBtn: { position: 'absolute', bottom: '0', right: '0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '11px' },
  profileName: { fontSize: '18px', fontWeight: '700', color: '#0f1b2d' },
  profileSector: { fontSize: '13px', color: '#4a5568', marginTop: '2px' },
  profileGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#0f1b2d', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#4a5568' },
  msgSuccess: { background: '#d1fae5', color: '#065f38', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  msgError: { background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  formCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '20px' },
  formTitle: { fontSize: '15px', fontWeight: '700', color: '#0f1b2d', marginBottom: '16px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  group: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', boxSizing: 'border-box', resize: 'vertical' },
  note: { background: '#fef3cd', color: '#92400e', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' },
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  empty: { padding: '48px', textAlign: 'center', color: '#9aa5b4', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9aa5b4', background: '#f5f7fa', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '13px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#4a5568' },
  badgeBlue: { background: '#e8f0fd', color: '#1d6bdb', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  badgePurple: { background: '#f3e8ff', color: '#6b21a8', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  btnPrimary: { padding: '10px 20px', background: '#1d6bdb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' },
  btnDanger: { padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.15s' },
  btnLink: { background: 'none', border: 'none', color: '#1d6bdb', fontSize: '13px', cursor: 'pointer', fontWeight: '600', padding: 0, transition: 'color 0.15s' },
}

export default CompanyMyOffers
