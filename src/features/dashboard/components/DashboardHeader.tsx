import logoIcon from '@/assets/icons/logo-icon.png'
import { useWalletBalance } from '@/features/wallets/hooks/useWalletBalance';

export function DashboardHeader() {
  const { balance, currency, loading, error } = useWalletBalance();

  // Formateador de moneda dinámico
  const formatBalance = (value: number | null, curr: string) => {
    if (value === null) return '$ 0,00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
    }).format(value);
  };

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

        {loading ? (
          <strong style={{ fontSize: '1.5rem', opacity: 0.7 }}>Cargando balance...</strong>
        ) : error ? (
          <strong style={{ fontSize: '1.2rem', color: '#ef4444' }}>{error}</strong>
        ) : (
          <strong>{formatBalance(balance, currency)}</strong>
        )}

        <p>▲ Actualizado en tiempo real</p>
      </div>
    </section>
  );
}
