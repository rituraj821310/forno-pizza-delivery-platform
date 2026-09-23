import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Loader from '../components/Loader.jsx'

export default function AdminRoute() {
  const {
    isAuthenticated,
    isAdmin,
    loading,
  } = useAuth()

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Checking admin access..."
      />
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return <Outlet />
}
