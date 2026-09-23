import { Routes, Route } from 'react-router-dom'

import MainLayout from '../components/MainLayout.jsx'
import AdminLayout from '../components/AdminLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminRoute from './AdminRoute.jsx'

import Home from '../pages/user/Home.jsx'
import Menu from '../pages/user/Menu.jsx'
import Cart from '../pages/user/Cart.jsx'
import Checkout from '../pages/user/Checkout.jsx'
import OrderHistory from '../pages/user/OrderHistory.jsx'
import OrderTracking from '../pages/user/OrderTracking.jsx'
import Profile from '../pages/user/Profile.jsx'

import Login from '../pages/auth/Login.jsx'
import Register from '../pages/auth/Register.jsx'
import ForgotPassword from '../pages/auth/ForgotPassword.jsx'
import VerifyOTP from '../pages/auth/VerifyOTP.jsx'
import ResetPassword from '../pages/auth/ResetPassword.jsx'
import AdminLogin from '../pages/auth/AdminLogin.jsx'

import Dashboard from '../pages/admin/Dashboard.jsx'
import ManageMenu from '../pages/admin/ManageMenu.jsx'
import ManageOrders from '../pages/admin/ManageOrders.jsx'
import ManageUsers from '../pages/admin/ManageUsers.jsx'
import Inventory from '../pages/admin/Inventory.jsx'

import NotFound from '../pages/shared/NotFound.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          USER ROUTES
      ========================== */}
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/menu"
          element={<Menu />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/orders"
            element={<OrderHistory />}
          />

          <Route
            path="/orders/:id"
            element={<OrderTracking />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>
      </Route>

      {/* =========================
          ADMIN LOGIN
      ========================== */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* =========================
          ADMIN ROUTES
      ========================== */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<Dashboard />}
          />

          <Route
            path="/admin/orders"
            element={<ManageOrders />}
          />

          <Route
            path="/admin/menu"
            element={<ManageMenu />}
          />

          <Route
            path="/admin/users"
            element={<ManageUsers />}
          />

          <Route
            path="/admin/inventory"
            element={<Inventory />}
          />
        </Route>
      </Route>

      {/* =========================
          404
      ========================== */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  )
}