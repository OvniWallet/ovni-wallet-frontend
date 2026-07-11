import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
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

        <RegisterForm />
      </section>

      <aside className="auth-info">
        <p className="auth-info-label">Empezá hoy</p>
        <h2>Una cuenta para gestionar todas tus operaciones.</h2>
        <p>
          Creá tu perfil, organizá tus balances y accedé a las herramientas de
          Ovni Wallet desde cualquier dispositivo.
        </p>
      </aside>
    </main>
  )
}