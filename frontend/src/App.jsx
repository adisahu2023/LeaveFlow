import { Route, Routes } from 'react-router-dom'
import HomePage from './HomePage'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import EmployeeDashboard from './components/EmployeeDashboard'
import ManagerDashboard from './components/ManagerDashboard'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_EMPLOYEE']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default App
