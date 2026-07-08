import type { Balance } from '../types'

interface BalanceCardProps {
  balance: Balance
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <article>
      <h3>{balance.currency}</h3>
      <p>{balance.amount.toFixed(2)}</p>
    </article>
  )
}