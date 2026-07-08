import type { Transaction } from '../types'

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <section>
      <h2>Últimos movimientos</h2>

      <div className="transaction-list">
        {transactions.map((transaction) => (
          <article className="transaction-item" key={transaction.id}>
            <div>
              <strong>{transaction.description}</strong>
              <p>{transaction.type}</p>
            </div>

            <div>
              <strong>
                {transaction.amount.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {transaction.currency}
              </strong>
              <p>{transaction.status}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}