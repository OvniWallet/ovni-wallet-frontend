import { useWalletBalance } from '../hooks/useWalletBalance'
import { BalanceCard } from '../components/BalanceCard'

export function WalletsDashboard() {
  const { balances, loading, error, refetch } = useWalletBalance()

  return (
    <section className="wallets-section">
      <div className="section-heading">
        <div>
          <p>Distribución</p>
          <h2>Mis balances</h2>
        </div>

        <button type="button" onClick={refetch} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="wallets-loading">
          <p>Cargando tus saldos...</p>
        </div>
      )}

      {/* Estado de error */}
      {error && !loading && (
        <div className="wallets-error">
          <p>{error}</p>
          <button type="button" onClick={refetch} className="btn-retry">
            Reintentar
          </button>
        </div>
      )}

      {/* Renderizado de balances */}
      {!loading && !error && (
        <div className="balance-grid">
          {balances.length === 0 ? (
            <p className="no-balances">No tienes balances inicializados.</p>
          ) : (
            balances.map((balance) => (
              <BalanceCard key={balance.currency} balance={balance} />
            ))
          )}
        </div>
      )}
    </section>
  )
}