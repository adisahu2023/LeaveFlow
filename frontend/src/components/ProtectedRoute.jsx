import { jwtDecode } from 'jwt-decode'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  try {
    const user = jwtDecode(token)

    if (user.exp && user.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />
    }

    return children
  } catch {
    localStorage.removeItem('token')
    return <Navigate to="/login" replace />
  }
}

export default ProtectedRoute
