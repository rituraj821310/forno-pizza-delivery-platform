import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  FiShoppingBag,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronRight,
} from 'react-icons/fi'

import Logo from './Logo.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'
import { classNames } from '../utils/classNames.js'

const navLinkClass = ({ isActive }) =>
  classNames(
    'relative px-3 py-2 text-sm font-semibold transition-all duration-200',
    'rounded-full',
    isActive
      ? 'bg-tomato/10 text-tomato'
      : 'text-char/65 hover:bg-char/5 hover:text-char'
  )

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { itemCount } = useCart()

  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Glass navigation */}
      <div className="border-b border-char/8 bg-flour/85 backdrop-blur-xl">
        <div className="page-container">
          <div className="flex h-[72px] items-center justify-between">

            {/* ───────────────── LOGO ───────────────── */}
            {/* Logo already contains its own Link */}
            <div className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
              <Logo />
            </div>

            {/* ───────────────── DESKTOP NAV ───────────────── */}
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink to="/menu" className={navLinkClass}>
                Menu
              </NavLink>

              {isAuthenticated && (
                <NavLink to="/orders" className={navLinkClass}>
                  My Orders
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
            </nav>

            {/* ───────────────── DESKTOP ACTIONS ───────────────── */}
            <div className="hidden items-center gap-3 md:flex">

              {/* Cart */}
              <Link
                to="/cart"
                aria-label="View cart"
                className="
                  group relative
                  flex h-11 w-11 items-center justify-center
                  rounded-full
                  border border-char/10
                  bg-white/60
                  text-char/70
                  transition-all duration-200
                  hover:border-tomato/20
                  hover:bg-tomato/5
                  hover:text-tomato
                "
              >
                <FiShoppingBag
                  size={20}
                  strokeWidth={1.8}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5"
                />

                {itemCount > 0 && (
                  <span
                    className="
                      absolute -right-1 -top-1
                      flex h-[21px] min-w-[21px]
                      items-center justify-center
                      rounded-full
                      bg-tomato
                      px-1
                      text-[10px]
                      font-bold
                      text-white
                      shadow-md
                      ring-2 ring-flour
                    "
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Divider */}
              <div className="h-7 w-px bg-char/10" />

              {/* Authentication actions */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="
                      group flex items-center gap-2
                      rounded-full
                      px-3 py-2
                      transition-colors duration-200
                      hover:bg-char/5
                    "
                  >
                    <span
                      className="
                        flex h-8 w-8 items-center justify-center
                        rounded-full
                        bg-tomato
                        text-sm font-bold text-white
                        shadow-sm
                      "
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || (
                        <FiUser size={15} />
                      )}
                    </span>

                    <span
                      className="
                        max-w-[110px]
                        truncate
                        text-sm
                        font-semibold
                        text-char/80
                        group-hover:text-char
                      "
                    >
                      {user?.name?.split(' ')[0] || 'Profile'}
                    </span>
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex items-center gap-2
                      rounded-full
                      px-3 py-2
                      text-sm font-semibold
                      text-char/55
                      transition-all duration-200
                      hover:bg-tomato/8
                      hover:text-tomato
                    "
                  >
                    <FiLogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="btn-ghost !px-4 !py-2.5 text-sm"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    className="btn-primary !px-5 !py-2.5 text-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* ───────────────── MOBILE ACTIONS ───────────────── */}
            <div className="flex items-center gap-2 md:hidden">

              {/* Mobile cart */}
              <Link
                to="/cart"
                aria-label="View cart"
                className="
                  relative flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  border border-char/10
                  bg-white/60
                  text-char/75
                "
              >
                <FiShoppingBag size={19} />

                {itemCount > 0 && (
                  <span
                    className="
                      absolute -right-1 -top-1
                      flex h-5 min-w-5
                      items-center justify-center
                      rounded-full
                      bg-tomato
                      px-1
                      text-[10px]
                      font-bold text-white
                      ring-2 ring-flour
                    "
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu */}
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  border border-char/10
                  bg-white/60
                  text-char
                  transition-all duration-200
                  hover:bg-char/5
                "
              >
                {menuOpen ? (
                  <FiX size={21} />
                ) : (
                  <FiMenu size={21} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────── MOBILE MENU ───────────────── */}
      {menuOpen && (
        <div className="border-b border-char/10 bg-flour shadow-xl md:hidden">
          <div className="page-container py-5">

            {/* User information */}
            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="
                  mb-4 flex items-center gap-3
                  rounded-2xl
                  border border-char/10
                  bg-white/70
                  p-3
                  transition-colors
                  hover:bg-white
                "
              >
                <span
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-tomato
                    text-sm font-bold text-white
                  "
                >
                  {user?.name?.charAt(0)?.toUpperCase() || (
                    <FiUser size={17} />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-char">
                    {user?.name || 'User'}
                  </p>

                  <p className="truncate text-xs text-char/50">
                    View your profile
                  </p>
                </div>

                <FiChevronRight
                  size={18}
                  className="text-char/30"
                />
              </Link>
            )}

            {/* Navigation links */}
            <nav className="flex flex-col gap-1">

              <MobileNavLink
                to="/menu"
                onClick={() => setMenuOpen(false)}
              >
                Menu
              </MobileNavLink>

              {isAuthenticated && (
                <MobileNavLink
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                >
                  My Orders
                </MobileNavLink>
              )}

              {isAdmin && (
                <MobileNavLink
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Dashboard
                </MobileNavLink>
              )}

              <MobileNavLink
                to="/cart"
                onClick={() => setMenuOpen(false)}
              >
                <span>Cart</span>

                {itemCount > 0 && (
                  <span
                    className="
                      ml-auto
                      rounded-full
                      bg-tomato/10
                      px-2.5 py-1
                      text-xs font-bold
                      text-tomato
                    "
                  >
                    {itemCount}{' '}
                    {itemCount === 1 ? 'item' : 'items'}
                  </span>
                )}
              </MobileNavLink>
            </nav>

            {/* Auth actions */}
            <div className="mt-5 border-t border-char/10 pt-5">

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex w-full items-center justify-between
                    rounded-2xl
                    px-4 py-3
                    text-sm font-semibold
                    text-tomato
                    transition-colors
                    hover:bg-tomato/5
                  "
                >
                  <span>Log out</span>
                  <FiLogOut size={17} />
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="btn-secondary !py-3 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    className="btn-primary !py-3 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

/* =========================================================
   MOBILE NAV LINK
   ========================================================= */

function MobileNavLink({ to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        classNames(
          'flex items-center rounded-2xl px-4 py-3.5',
          'text-sm font-semibold transition-all duration-200',
          isActive
            ? 'bg-tomato/10 text-tomato'
            : 'text-char/70 hover:bg-char/5 hover:text-char'
        )
      }
    >
      {children}
    </NavLink>
  )
}