import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand">
          <span className="brand-logo" aria-hidden="true">
            👽
          </span>

          <div>
            <strong>Ovni Wallet</strong>
            <p>Tu dinero, siempre bajo control.</p>
          </div>
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