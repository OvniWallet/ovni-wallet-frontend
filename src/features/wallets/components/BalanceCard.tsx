import type { Balance } from '../types'

interface BalanceCardProps {
  balance: Balance
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const formattedAmount = balance.amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <article className="balance-card">
      <span>{balance.currency}</span>
      <strong>{formattedAmount}</strong>
    </article>
  )
}