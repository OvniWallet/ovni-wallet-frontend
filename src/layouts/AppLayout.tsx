import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

const navigation = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Exchange', path: '/exchange' },
  { label: 'Movimientos', path: '/transactions' },
  { label: 'Tarjetas', path: '/cards' },
  { label: 'Chatbot', path: '/chatbot' },
]

export function AppLayout() {
  const { logout } = useAuth()

  return (
    <>
      <header className="app-header">
        <div className="app-header-top">
          <h1>Ovni Wallet</h1>

          <button type="button" onClick={logout}>
            Salir
          </button>
        </div>

        <nav className="app-nav">
          {navigation.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  )
}