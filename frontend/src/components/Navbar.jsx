import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/usdb_logo.png'

const Navbar = () => {

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const bellRef = useRef(null)

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setNotifications(res.data)
      setUnreadCount(res.data.filter(n => !n.isRead).length)
    } catch { /* network errors are non-critical */ }
  }

  useEffect(() => {
    if (!user || user.role !== 'student') return
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch { /* non-critical */ }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const links = {
    admin: [
      { label: 'Tableau de bord', path: '/admin/dashboard' },
      { label: 'Étudiants', path: '/admin/students' },
      { label: 'Enseignants', path: '/admin/teachers' },
      { label: 'Entreprises', path: '/admin/companies' },
      { label: 'Offres', path: '/admin/offers' },
    ],
    student: [
      { label: 'Offres', path: '/student/offers' },
      { label: 'Mes candidatures', path: '/student/applications' },
      { label: 'Mon profil', path: '/student/profile' },
    ],
    teacher: [
      { label: 'Étudiants', path: '/teacher/students' },
      { label: 'Recommandations', path: '/teacher/recommendations' },
    ],
    company: [
      { label: 'Mes offres', path: '/company/offers' },
    ],
  }

  const userLinks = user ? links[user.role] || [] : []

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <img src={logo} alt='USDB' style={styles.logo} />
        <Link to='/' style={styles.brandLink}>
          Stage<span style={styles.accent}>Link</span>
        </Link>
      </div>

      <div style={styles.links}>
        {userLinks.map((link) => (
          <Link key={link.path} to={link.path} style={styles.link}>
            {link.label}
          </Link>
        ))}
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            {user.role === 'student' && (
              <div ref={bellRef} style={{ position: 'relative' }}>
                <button onClick={() => setShowDropdown(!showDropdown)} style={styles.bellBtn}>
                  🔔
                  {unreadCount > 0 && (
                    <span style={styles.badge}>{unreadCount}</span>
                  )}
                </button>

                {showDropdown && (
                  <div style={styles.dropdown}>
                    <div style={styles.dropdownHeader}>
                      <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f1b2d' }}>
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <button style={styles.markAllBtn} onClick={handleMarkAllRead}>
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div style={styles.noNotif}>Aucune notification</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} style={{ ...styles.notifItem, background: n.isRead ? '#fff' : '#f0f7ff' }}>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={n.type === 'accepted' ? styles.badgeAccepted : styles.badgeRejected}>
                              {n.type === 'accepted' ? 'Acceptée' : 'Refusée'}
                            </span>
                          </div>
                          <div style={styles.notifMsg}>{n.message}</div>
                          <div style={styles.notifDate}>
                            {new Date(n.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <span style={styles.username}>{user.fullName || user.name}</span>
            <span style={styles.role}>{user.role}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link to='/login' style={styles.link}>Connexion</Link>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    height: '56px',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginRight: '24px',
  },
  logo: {
    width: '32px',
    height: '32px',
    objectFit: 'contain',
  },
  brandLink: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f1b2d',
    textDecoration: 'none',
  },
  accent: { color: '#0ea5a0' },
  links: { display: 'flex', gap: '4px', flex: 1 },
  link: {
    padding: '7px 14px',
    borderRadius: '7px',
    fontSize: '13px',
    color: '#4a5568',
    textDecoration: 'none',
  },
  right: { display: 'flex', alignItems: 'center', gap: '12px' },
  username: { fontSize: '13px', fontWeight: '600', color: '#0f1b2d' },
  role: {
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '20px',
    background: '#e8f0fd',
    color: '#1d6bdb',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    padding: '7px 14px',
    borderRadius: '7px',
    border: '1.5px solid #e2e8f0',
    background: 'transparent',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#4a5568',
    transition: 'background 0.15s',
  },
  bellBtn: {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '6px 8px',
    borderRadius: '8px',
    lineHeight: 1,
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: '#ef4444',
    color: '#fff',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    fontSize: '10px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: '320px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    zIndex: 200,
    maxHeight: '400px',
    overflowY: 'auto',
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    background: '#fff',
  },
  markAllBtn: {
    background: 'none',
    border: 'none',
    color: '#1d6bdb',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    padding: 0,
  },
  noNotif: {
    padding: '28px',
    textAlign: 'center',
    color: '#9aa5b4',
    fontSize: '13px',
  },
  notifItem: {
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
  },
  notifMsg: {
    fontSize: '13px',
    color: '#4a5568',
    lineHeight: '1.4',
    marginBottom: '4px',
  },
  notifDate: {
    fontSize: '11px',
    color: '#9aa5b4',
  },
  badgeAccepted: {
    background: '#d1fae5',
    color: '#065f38',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
  },
  badgeRejected: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
  },
}

export default Navbar
