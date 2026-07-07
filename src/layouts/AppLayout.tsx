import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function AppLayout() {
  const { logout } = useAuth()

  return (
    <>
      <header>
        <h1>Dashboard</h1>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/wallets">Wallets</Link>
          <Link to="/exchange">Exchange</Link>
          <Link to="/p2p">P2P</Link>
          <Link to="/transactions">Historial</Link>
          <Link to="/cards">Tarjetas</Link>
          <Link to="/chatbot">Chatbot</Link>

          <button type="button" onClick={logout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  )
}