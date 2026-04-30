import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const AdminDashboard = () => {

  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    students: 0, teachers: 0, companies: 0,
    pendingCompanies: 0, offers: 0, pendingOffers: 0
  })

  const headers = { Authorization: `Bearer ${user.token}` }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, companies, pendingCompanies, pendingOffers] = await Promise.all([
          axios.get('http://localhost:5000/api/users?role=student', { headers }),
          axios.get('http://localhost:5000/api/users?role=teacher', { headers }),
          axios.get('http://localhost:5000/api/companies', { headers }),
          axios.get('http://localhost:5000/api/companies?status=pending', { headers }),
          axios.get('http://localhost:5000/api/offers/pending', { headers }),
        ])
        setStats({
          students: students.data.length,
          teachers: teachers.data.length,
          companies: companies.data.length,
          pendingCompanies: pendingCompanies.data.length,
          pendingOffers: pendingOffers.data.length,
        })
      } catch (err) {
        console.log(err)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Étudiants inscrits', value: stats.students, icon: '🎓', action: () => navigate('/admin/students') },
    { label: 'Enseignants', value: stats.teachers, icon: '👨‍🏫', action: () => navigate('/admin/teachers') },
    { label: 'Entreprises totales', value: stats.companies, icon: '🏢', action: () => navigate('/admin/companies') },
    { label: 'Entreprises en attente', value: stats.pendingCompanies, icon: '⏳', action: () => navigate('/admin/companies') },
    { label: 'Offres en attente', value: stats.pendingOffers, icon: '📋', action: () => navigate('/admin/offers') },
  ]

  return (
    <div>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <div style={styles.pageTitle}>Tableau de bord</div>
          <div style={styles.pageSub}>Bienvenue, {user.fullName}</div>
        </div>
        <div style={styles.grid}>
          {cards.map((card, i) => (
            <div key={i} style={styles.card} onClick={card.action}>
              <div style={styles.cardIcon}>{card.icon}</div>
              <div style={styles.cardValue}>{card.value}</div>
              <div style={styles.cardLabel}>{card.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '32px', fontFamily: 'sans-serif' },
  pageHeader: { marginBottom: '28px' },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#0f1b2d', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#4a5568' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  card: {
    background: '#ffffff', borderRadius: '12px', padding: '24px',
    border: '1px solid #e2e8f0', cursor: 'pointer',
    transition: 'box-shadow .2s',
  },
  cardIcon: { fontSize: '28px', marginBottom: '12px' },
  cardValue: { fontSize: '32px', fontWeight: '700', color: '#0f1b2d', marginBottom: '4px' },
  cardLabel: { fontSize: '13px', color: '#9aa5b4', fontWeight: '500' },
}

export default AdminDashboard