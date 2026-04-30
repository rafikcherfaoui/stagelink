import { createContext, useState, useContext } from 'react'

// create the context
const AuthContext = createContext()

// this wraps the whole app and provides user data to every page
export const AuthProvider = ({ children }) => {

  // check if user is already logged in from a previous session
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  // login — saves user and token to state and localStorage
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // logout — clears everything
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// custom hook — instead of writing useContext(AuthContext) everywhere
// we just write useAuth()
export const useAuth = () => useContext(AuthContext)