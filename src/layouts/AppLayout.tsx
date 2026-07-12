import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

const navigation = [
  { label: 'Inicio', path: '/dashboard', symbol: '⌂' },
  { label: 'Transferir', path: '/p2p', symbol: '↗' },
  { label: 'Exchange', path: '/exchange', symbol: '⇄' },
  { label: 'Tarjetas', path: '/cards', symbol: '▣' },
  { label: 'Movimientos', path: '/transactions', symbol: '≡' },
  { label: 'Asistente', path: '/chatbot', symbol: '◇' },
]

export function AppLayout() {
  const { logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo" aria-hidden="true">
            👽
          </span>

          <div>
            <strong>Ovni Wallet</strong>
            <small>Billetera digital</small>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegación principal">
          {navigation.map(({ label, path, symbol }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive ? 'nav-item nav-item-active' : 'nav-item'
              }
            >
              <span aria-hidden="true">{symbol}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" type="button" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>

      <div className="app-content">
        <header className="mobile-header">
          <div className="mobile-brand">
            <span aria-hidden="true">👽</span>
            <strong>Ovni Wallet</strong>
          </div>

          <button type="button" onClick={logout}>
            Salir
          </button>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>

      <nav className="mobile-navigation" aria-label="Navegación móvil">
        {navigation.slice(0, 5).map(({ label, path, symbol }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive
                ? 'mobile-nav-item mobile-nav-item-active'
                : 'mobile-nav-item'
            }
          >
            <span aria-hidden="true">{symbol}</span>
            <small>{label}</small>
          </NavLink>
        ))}
      </nav>
    </div>
  )
} 