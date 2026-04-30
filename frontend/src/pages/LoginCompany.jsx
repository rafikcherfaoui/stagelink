import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const LoginCompany = () => {

  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', sector: '', address: '', phone: ''
  })
  const [mode, setMode] = useState('login')  // login or register
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login-company`, form)
      login(res.data)
      navigate('/company/offers')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register-company`, registerForm)
      setSuccess('Inscription envoyée — en attente de validation par l\'administration.')
      setMode('login')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        <div style={styles.brand}>Dahlab<span style={styles.accent}>Connect</span></div>

        <div style={styles.tabs}>
          <div
            style={mode === 'login' ? styles.tabActive : styles.tab}
            onClick={() => setMode('login')}
          >
            Connexion
          </div>
          <div
            style={mode === 'register' ? styles.tabActive : styles.tab}
            onClick={() => setMode('register')}
          >
            S'inscrire
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={styles.group}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type='email'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder='contact@entreprise.dz'
                required
              />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Mot de passe</label>
              <input
                style={styles.input}
                type='password'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder='••••••••'
                required
              />
            </div>
            <button style={styles.btn} type='submit' disabled={loading}
              onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
              onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={styles.group}>
              <label style={styles.label}>Nom de l'entreprise</label>
              <input style={styles.input} type='text'
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                placeholder='TechAlgeria SARL' required />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} type='email'
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder='contact@entreprise.dz' required />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Mot de passe</label>
              <input style={styles.input} type='password'
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder='••••••••' required />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Secteur</label>
              <input style={styles.input} type='text'
                value={registerForm.sector}
                onChange={(e) => setRegisterForm({ ...registerForm, sector: e.target.value })}
                placeholder='Informatique' required />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Adresse</label>
              <input style={styles.input} type='text'
                value={registerForm.address}
                onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                placeholder='Alger, Algérie' />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Téléphone</label>
              <input style={styles.input} type='text'
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                placeholder='+213 555 000 111' />
            </div>
            <button style={styles.btn} type='submit' disabled={loading}
              onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
              onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
              {loading ? 'Envoi...' : 'Envoyer la demande →'}
            </button>
          </form>
        )}

        <div style={styles.footer}>
          <Link to='/' style={styles.footerLink}>← Retour à l'accueil</Link>
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    padding: '20px',
  },
  box: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    border: '1px solid #e2e8f0',
  },
  brand: { fontSize: '22px', fontWeight: '800', color: '#0f1b2d', marginBottom: '24px' },
  accent: { color: '#0ea5a0' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: {
    flex: 1, padding: '9px', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500', color: '#4a5568',
  },
  tabActive: {
    flex: 1, padding: '9px', border: '1.5px solid #1d6bdb',
    borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500', color: '#1d6bdb',
    background: '#e8f0fd',
  },
  error: {
    background: '#fee2e2', color: '#991b1b',
    padding: '12px', borderRadius: '8px',
    fontSize: '13px', marginBottom: '16px',
  },
  successMsg: {
    background: '#d1fae5', color: '#065f38',
    padding: '12px', borderRadius: '8px',
    fontSize: '13px', marginBottom: '16px',
  },
  group: { marginBottom: '14px' },
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: '#4a5568', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  input: {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'sans-serif',
    color: '#0f1b2d', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '12px',
    background: '#1d6bdb', color: '#ffffff',
    border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px',
    fontFamily: 'sans-serif', transition: 'background 0.15s',
  },
  footer: { textAlign: 'center', fontSize: '13px', color: '#9aa5b4', marginTop: '16px' },
  footerLink: { color: '#1d6bdb', textDecoration: 'none', fontWeight: '500' },
}

export default LoginCompany