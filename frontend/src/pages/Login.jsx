import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Login = () => {

  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form)
      login(res.data)   // save user and token in context + localStorage

      // redirect based on role
      const role = res.data.role
      if (role === 'admin') navigate('/admin/dashboard')
      else if (role === 'student') navigate('/student/offers')
      else if (role === 'teacher') navigate('/teacher/students')

    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        <div style={styles.brand}>
          Stage<span style={styles.accent}>Link</span>
        </div>
        <div style={styles.title}>Connexion</div>
        <div style={styles.subtitle}>Étudiant · Enseignant · Admin</div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.group}>
            <label style={styles.label}>Email universitaire</label>
            <input
              style={styles.input}
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder='prenom.nom@univ-blida.dz'
              required
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Mot de passe</label>
            <input
              style={styles.input}
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
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

        <div style={styles.footer}>
          Vous êtes une entreprise ?{' '}
          <Link to='/login-company' style={styles.footerLink}>
            Connexion entreprise
          </Link>
        </div>

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
    maxWidth: '420px',
    border: '1px solid #e2e8f0',
  },
  brand: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f1b2d',
    marginBottom: '24px',
  },
  accent: { color: '#0ea5a0' },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f1b2d',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#9aa5b4',
    marginBottom: '28px',
  },
  error: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  group: { marginBottom: '16px' },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'sans-serif',
    color: '#0f1b2d',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: '#1d6bdb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    fontFamily: 'sans-serif',
    transition: 'background 0.15s',
  },
  footer: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#9aa5b4',
    marginTop: '16px',
  },
  footerLink: { color: '#1d6bdb', textDecoration: 'none', fontWeight: '500' },
}

export default Login