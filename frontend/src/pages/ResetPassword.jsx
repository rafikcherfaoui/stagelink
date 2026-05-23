import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'
import { lightTheme, darkTheme } from '../styles/theme'

const ResetPassword = () => {

  // useSearchParams reads ?token=xxx&type=yyy from the URL
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const userType = searchParams.get('type')

  const { isDark } = useTheme()
  const theme = isDark ? darkTheme : lightTheme
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // check passwords match before sending to backend
    if (newPassword !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        { token, newPassword, userType }
      )
      setMessage(res.data.message)

      // redirect to login after 3 seconds
      setTimeout(() => {
        if (userType === 'company') navigate('/login-company')
        else navigate('/login')
      }, 3000)

    } catch (err) {
      setError(err.response?.data?.message || 'Lien invalide ou expiré')
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '20px',
    },
    box: {
      background: theme.card,
      borderRadius: '16px',
      padding: '40px',
      width: '100%',
      maxWidth: '420px',
      border: `1px solid ${theme.border}`,
    },
    brand: { fontSize: '22px', fontWeight: '800', color: theme.text, marginBottom: '24px' },
    accent: { color: '#0ea5a0' },
    title: { fontSize: '22px', fontWeight: '700', color: theme.text, marginBottom: '6px' },
    subtitle: { fontSize: '13px', color: '#9aa5b4', marginBottom: '24px' },
    success: {
      background: '#d1fae5', color: '#065f38',
      padding: '14px', borderRadius: '8px',
      fontSize: '13px', marginBottom: '16px', lineHeight: '1.8'
    },
    errorMsg: {
      background: '#fee2e2', color: '#991b1b',
      padding: '12px', borderRadius: '8px',
      fontSize: '13px', marginBottom: '16px'
    },
    group: { marginBottom: '16px' },
    label: {
      display: 'block', fontSize: '12px', fontWeight: '600',
      color: theme.text2, marginBottom: '6px',
      textTransform: 'uppercase', letterSpacing: '0.5px'
    },
    input: {
      width: '100%', padding: '11px 14px',
      border: `1.5px solid ${theme.border}`,
      borderRadius: '8px', fontSize: '14px',
      fontFamily: 'sans-serif', color: theme.text,
      background: theme.inputBg, boxSizing: 'border-box',
    },
    btn: {
      width: '100%', padding: '12px',
      background: '#1d6bdb', color: '#ffffff',
      border: 'none', borderRadius: '8px',
      fontSize: '14px', fontWeight: '600',
      cursor: 'pointer', fontFamily: 'sans-serif',
    },
    footer: { textAlign: 'center', marginTop: '16px' },
    footerLink: { color: '#1d6bdb', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }
  }

  // if no token in the URL — show an error
  if (!token || !userType) {
    return (
      <div style={styles.container}>
        <div style={styles.box}>
          <div style={styles.brand}>Dahlab<span style={styles.accent}>Connect</span></div>
          <div style={styles.errorMsg}>Lien invalide. Veuillez refaire une demande.</div>
          <div style={styles.footer}>
            <Link to='/forgot-password' style={styles.footerLink}>← Faire une nouvelle demande</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        <div style={styles.brand}>Dahlab<span style={styles.accent}>Connect</span></div>
        <div style={styles.title}>Nouveau mot de passe</div>
        <div style={styles.subtitle}>Choisissez un nouveau mot de passe sécurisé</div>

        {message && (
          <div style={styles.success}>
            {message}<br />
            <span style={{ fontSize: '12px' }}>Redirection vers la connexion...</span>
          </div>
        )}
        {error && <div style={styles.errorMsg}>{error}</div>}

        {!message && (
          <form onSubmit={handleSubmit}>

            <div style={styles.group}>
              <label style={styles.label}>Nouveau mot de passe</label>
              <input
                style={styles.input}
                type='password'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder='••••••••'
                required
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Confirmer le mot de passe</label>
              <input
                style={styles.input}
                type='password'
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder='••••••••'
                required
              />
            </div>

            <button
              style={styles.btn}
              type='submit'
              disabled={loading}
              onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
              onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer →'}
            </button>

          </form>
        )}

        <div style={styles.footer}>
          <Link to='/login' style={styles.footerLink}>← Retour à la connexion</Link>
        </div>

      </div>
    </div>
  )
}

export default ResetPassword