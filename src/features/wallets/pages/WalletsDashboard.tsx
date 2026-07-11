import { BalanceCard } from '../components/BalanceCard'

const balances = [
  { currency: 'ARS', amount: 125000.5 },
  { currency: 'USD', amount: 250.75 },
  { currency: 'EUR', amount: 180.2 },
]

export function WalletsDashboard() {
  return (
    <section className="wallets-section">
      <div className="section-heading">
        <div>
          <p>Distribución</p>
          <h2>Mis balances</h2>
        </div>

        <button type="button">Ver todos</button>
      </div>

      <div className="balance-grid">
        {balances.map((balance) => (
          <BalanceCard key={balance.currency} balance={balance} />
        ))}
      </div>
    </section>
  )
}