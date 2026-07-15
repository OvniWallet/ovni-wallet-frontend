import logoIcon from '@/assets/icons/logo-icon.png'

export function DashboardHeader() {
  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero-top">
        <div>
          <p className="dashboard-kicker">Resumen general</p>

          <h1>¡Hola! Bienvenido a Ovni Wallet</h1>

          <span>
            Gestioná tus balances, movimientos y operaciones desde un solo
            lugar.
          </span>
        </div>

        <div className="dashboard-avatar" aria-hidden="true">
          <img src={logoIcon} alt="" />
        </div>
      </div>

      <div className="dashboard-balance">
        <small>Balance total</small>

        <strong>$ 185.430,25</strong>

        <p>▲ +12,5 % respecto al último mes</p>
      </div>
    </section>
  )
}