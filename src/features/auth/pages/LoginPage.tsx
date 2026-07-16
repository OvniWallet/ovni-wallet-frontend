import { LoginForm } from '../components/LoginForm'
import logoHorizontal from '@/assets/icons/logo-horizontal.png'

export function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand auth-brand">
          <img
            className="auth-brand-logo"
            src={logoHorizontal}
            alt="Ovni Wallet"
          />

          <p>Tu dinero, siempre bajo control.</p>
        </div>

        <LoginForm />
      </section>

      <aside className="auth-info">
        <p className="auth-info-label">Billetera digital</p>
        <h2>Gestioná tus finanzas desde un solo lugar.</h2>
        <p>
          Consultá tus balances, transferí dinero y administrá tus operaciones
          de forma simple y segura.
        </p>
      </aside>
    </main>
  )
}