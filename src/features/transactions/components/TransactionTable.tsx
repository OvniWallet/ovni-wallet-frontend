import type { Transaction } from '../types'

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <section>
      <h2>Últimos movimientos</h2>

      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <strong>{transaction.description}</strong>
            <span>
              {' '}
              {transaction.amount.toFixed(2)} {transaction.currency}
            </span>
            <small> · {transaction.status}</small>
          </li>
        ))}
      </ul>
    </section>
  )
}