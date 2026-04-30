import { Link } from 'react-router-dom'
import logo from '../assets/usdb_logo.png'

const Landing = () => {
  return (
    <div style={styles.container}>

      {/* header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <img src={logo} alt='USDB Logo' style={styles.logo} />
          <div style={styles.brand}>
            Stage<span style={styles.accent}>Link</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <Link to='/login' style={styles.headerLink}>Connexion</Link>
        </div>
      </div>

     {/* hero */}
<div style={styles.hero}>
  <div style={styles.universityBadge}>
    <img src={logo} alt='USDB Logo' style={styles.heroLogo} />
    <span style={styles.badge}>Université Saad Dahlab — Blida 1</span>
  </div>
  <h1 style={styles.title}>
    La plateforme officielle<br />des stages et emplois
  </h1>
  <p style={styles.subtitle}>
    Un espace institutionnel sécurisé qui connecte les étudiants,
    les enseignants et les entreprises partenaires de l'université.
  </p>

  <div style={styles.buttons}>
    <Link to='/login' style={styles.btnPrimary}
      onMouseEnter={e => e.currentTarget.style.background = '#1454b6'}
      onMouseLeave={e => e.currentTarget.style.background = '#1d6bdb'}>
      Étudiant / Enseignant →
    </Link>
    <Link to='/login-company' style={styles.btnSecondary}
      onMouseEnter={e => e.currentTarget.style.background = '#f5f7fa'}
      onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
      Entreprise →
    </Link>
  </div>
</div>

      {/* features */}
      <div style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🎓</div>
          <div style={styles.featureTitle}>Comptes institutionnels</div>
          <div style={styles.featureText}>
            Chaque étudiant possède un compte unique créé par l'administration
            via son email universitaire officiel.
          </div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🏢</div>
          <div style={styles.featureTitle}>Entreprises validées</div>
          <div style={styles.featureText}>
            Toutes les entreprises sont vérifiées et approuvées par
            l'administration avant de pouvoir publier des offres.
          </div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>✍️</div>
          <div style={styles.featureTitle}>Lettres de recommandation</div>
          <div style={styles.featureText}>
            Les enseignants peuvent rédiger des lettres de recommandation
            pour valoriser les étudiants méritants.
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={styles.footer}>
        <img src={logo} alt='USDB Logo' style={styles.footerLogo} />
        <span>© 2026 Université Saad Dahlab — Blida 1. Tous droits réservés.</span>
      </div>

    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
    fontFamily: 'sans-serif',
  },
  header: {
    padding: '16px 48px',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '38px',
    height: '38px',
    objectFit: 'contain',
  },
  brand: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f1b2d',
  },
  accent: { color: '#0ea5a0' },
  headerRight: {},
  headerLink: {
    padding: '8px 18px',
    background: '#1d6bdb',
    color: '#ffffff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 20px 50px',
    maxWidth: '700px',
    margin: '0 auto',
  },
  universityBadge: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '24px',
},
heroLogo: {
  width: '36px',
  height: '36px',
  objectFit: 'contain',
},
badge: {
  fontSize: '14px',
  fontWeight: '600',
  color: '#057122',
},
  title: {
    fontSize: '42px',
    fontWeight: '800',
    color: '#0f1b2d',
    lineHeight: '1.2',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#4a5568',
    lineHeight: '1.7',
    marginBottom: '40px',
  },
  buttons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '14px 28px',
    background: '#1d6bdb',
    color: '#ffffff',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'background 0.15s',
  },
  btnSecondary: {
    padding: '14px 28px',
    background: '#ffffff',
    color: '#0f1b2d',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    border: '1.5px solid #e2e8f0',
    transition: 'background 0.15s',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px 60px',
  },
  feature: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid #e2e8f0',
  },
  featureIcon: { fontSize: '28px', marginBottom: '12px' },
  featureTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f1b2d',
    marginBottom: '8px',
  },
  featureText: {
    fontSize: '13px',
    color: '#4a5568',
    lineHeight: '1.6',
  },
  footer: {
    borderTop: '1px solid #e2e8f0',
    background: '#ffffff',
    padding: '20px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '12px',
    color: '#9aa5b4',
  },
  footerLogo: {
    width: '24px',
    height: '24px',
    objectFit: 'contain',
    opacity: 0.6,
  },
}

export default Landing