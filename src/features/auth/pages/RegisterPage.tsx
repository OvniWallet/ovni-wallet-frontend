import { RegisterForm } from '../components/RegisterForm'
import logoHorizontal from '@/assets/icons/logo-horizontal.png'

export function RegisterPage() {
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