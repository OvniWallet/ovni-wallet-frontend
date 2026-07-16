import type { Balance } from '../types'

interface BalanceCardProps {
  balance: Balance
}

const currencySymbols: Record<string, string> = {
  ARS: '$',
  USD: 'US$',
  EUR: '€',
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const formattedAmount = balance.amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <article className="balance-card">
      <div className="balance-card-header">
        <span className="balance-currency">{balance.currency}</span>
        <span className="balance-status">Disponible</span>
      </div>

      <strong>
        {currencySymbols[balance.currency] ?? ''}
        {formattedAmount}
      </strong>

      <p>Saldo actual</p>
    </article>
  )
}