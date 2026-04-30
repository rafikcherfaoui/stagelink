import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// roles = which roles are allowed to see this page
const PrivateRoute = ({ children, roles }) => {

  const { user } = useAuth()

  // not logged in — send to login page
  if (!user) {
    return <Navigate to='/login' />
  }

  // logged in but wrong role — send back to login
  if (roles && !roles.includes(user.role)) {
    return <Navigate to='/login' />
  }

  // everything is fine — show the page
  return children
}

export default PrivateRoute