const ThemeToggleIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="dc-theme-mask">
        <rect width="24" height="24" fill="white"/>
        <circle cx="14.5" cy="10" r="4.3" fill="black"/>
      </mask>
    </defs>
    {/* Cardinal rays */}
    <rect x="11" y="1.5" width="2" height="3.5" rx="1"/>
    <rect x="11" y="19" width="2" height="3.5" rx="1"/>
    <rect x="1.5" y="11" width="3.5" height="2" rx="1"/>
    <rect x="19" y="11" width="3.5" height="2" rx="1"/>
    {/* Diagonal rays */}
    <rect x="3.93" y="3.18" width="2" height="3.5" rx="1" transform="rotate(45 4.93 4.93)"/>
    <rect x="18.07" y="3.18" width="2" height="3.5" rx="1" transform="rotate(-45 19.07 4.93)"/>
    <rect x="3.93" y="17.32" width="2" height="3.5" rx="1" transform="rotate(-45 4.93 19.07)"/>
    <rect x="18.07" y="17.32" width="2" height="3.5" rx="1" transform="rotate(45 19.07 19.07)"/>
    {/* Sun circle with crescent moon cutout */}
    <circle cx="12" cy="12" r="5.5" mask="url(#dc-theme-mask)"/>
  </svg>
)

export default ThemeToggleIcon
