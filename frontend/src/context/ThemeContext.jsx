import { createContext, useContext, useState, useEffect } from 'react'

// The ThemeContext holds whether dark mode is on and a function to toggle it.
// Any component in the app can read this by calling useTheme().
const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Read the saved preference from localStorage on first load.
  // If nothing was saved before, default to light mode (false).
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('dahlabconnect-theme') === 'dark'
  })

  // Whenever isDark changes, save the new preference to localStorage
  // so it persists after the user closes and reopens the browser.
  useEffect(() => {
    localStorage.setItem('dahlabconnect-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook — import this in any component to get isDark and toggleTheme
export const useTheme = () => useContext(ThemeContext)
