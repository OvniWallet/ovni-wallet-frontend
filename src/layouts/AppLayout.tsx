import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import logoIcon from '@/assets/icons/logo-icon.png'

const navigation = [
  { label: 'Inicio', path: '/dashboard', symbol: '⌂' },
  { label: 'Transferir', path: '/p2p', symbol: '↗' },
  { label: 'Cambio', path: '/exchange', symbol: '⇄' },
  { label: 'Tarjetas', path: '/cards', symbol: '▣' },
  { label: 'Movimientos', path: '/transactions', symbol: '≡' },
  { label: 'Asistente', path: '/chatbot', symbol: '◇' },
]

export function AppLayout() {
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const isChatbotRoute = pathname.startsWith('/chatbot')

  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <img className="sidebar-logo" src={logoIcon} alt="" aria-hidden="true" />
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
            <img className="mobile-logo" src={logoIcon} alt="" aria-hidden="true" />
            <strong>Ovni Wallet</strong>
          </div>

          <button type="button" onClick={logout}>Salir</button>
        </header>

        <main className="app-main"><Outlet /></main>
      </div>

      {!isChatbotRoute && (
        <NavLink
          className="mobile-chatbot-button"
          to="/chatbot"
          aria-label="Abrir asistente"
        >
          <Bot size={24} />
        </NavLink>
      )}

      <nav className="mobile-navigation" aria-label="Navegación móvil">
        {navigation.slice(0, 5).map(({ label, path, symbol }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? 'mobile-nav-item mobile-nav-item-active' : 'mobile-nav-item'
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
