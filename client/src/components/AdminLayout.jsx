import { NavLink, Outlet } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { classNames } from '../utils/classNames.js'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/menu', label: 'Menu' },
  { to: '/admin/users', label: 'Users' },
]

export default function AdminLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex bg-flour">
      <aside className="hidden md:flex md:w-60 flex-col border-r border-char/10 bg-white px-5 py-6">
        <Logo className="mb-8" />
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                classNames(
                  'px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive ? 'bg-tomato/10 text-tomato-dark' : 'text-char/70 hover:bg-char/5'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-char/10">
          <NavLink to="/" className="text-sm font-medium text-char/60 hover:text-char">
            ← Back to site
          </NavLink>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-char/10 px-5 h-14 flex items-center justify-between">
          <Logo />
          <nav className="flex gap-3 overflow-x-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  classNames('text-xs font-semibold whitespace-nowrap', isActive ? 'text-tomato' : 'text-char/60')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <div className="px-5 sm:px-8 py-5 border-b border-char/10 bg-white flex items-center justify-between">
          <p className="text-sm text-char/50">Signed in as</p>
          <p className="text-sm font-semibold text-char">{user?.name}</p>
        </div>

        <main className="flex-1 px-5 sm:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
