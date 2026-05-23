import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'
import { lightTheme, darkTheme } from '../styles/theme'

const ForgotPassword = () => {

  const { isDark } = useTheme()
  const theme = isDark ? darkTheme : lightTheme

  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState('user')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email, userType }
      )
      setMessage(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
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
      fontSize: '13px', marginBottom: '16px', lineHeight: '1.6'
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

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        <div style={styles.brand}>Dahlab<span style={styles.accent}>Connect</span></div>
        <div style={styles.title}>Mot de passe oublié</div>
        <div style={styles.subtitle}>Entrez votre email pour recevoir un lien de réinitialisation</div>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.errorMsg}>{error}</div>}

        {/* hide the form once the email is sent */}
        {!message && (
          <form onSubmit={handleSubmit}>

            <div style={styles.group}>
              <label style={styles.label}>Type de compte</label>
              <select
                style={styles.input}
                value={userType}
                onChange={e => setUserType(e.target.value)}
              >
                <option value='user'>Étudiant / Enseignant</option>
                <option value='company'>Entreprise</option>
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={userType === 'company' ? 'contact@entreprise.dz' : 'prenom.nom@univ-blida.dz'}
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
              {loading ? 'Envoi en cours...' : 'Envoyer le lien →'}
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

export default ForgotPassword