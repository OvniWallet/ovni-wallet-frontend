import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Transaction } from '../types'
import { getLatestTransactions } from '../mocks/transactions.mock'

interface TransactionTableProps {
  transactions?: Transaction[]
  limit?: number
  showAllLink?: boolean
}

const transactionIcons: Record<string, string> = {
  DEPOSIT: '↓',
  WITHDRAWAL: '↑',
  EXCHANGE: '⇄',
  P2P_TRANSFER: '↗',
  CARD_SPEND: '▣',
}

export function TransactionTable({
  transactions,
  limit,
  showAllLink = false,
}: TransactionTableProps) {
  const [history, setHistory] = useState<Transaction[]>(() =>
    getLatestTransactions(),
  )

  useEffect(() => {
    if (transactions) return

    setHistory(getLatestTransactions())

    const interval = setInterval(() => {
      setHistory(getLatestTransactions())
    }, 1000)

    return () => clearInterval(interval)
  }, [transactions])

  const source = transactions ?? history
  const visibleTransactions = limit ? source.slice(0, limit) : source

  return (
    <section className="transactions-section">
      <header className="section-heading">
        <span>
          <p>Actividad</p>
          <h2>Últimos movimientos</h2>
        </span>

        {showAllLink && (
          <Link className="section-link" to="/transactions">
            Ver todos
          </Link>
        )}
      </header>

      <div className="transaction-list">
        {visibleTransactions.map((transaction) => (
          <article className="transaction-item" key={transaction.id}>
            <span className="transaction-icon" aria-hidden="true">
              {transactionIcons[transaction.type] ?? '•'}
            </span>

            <p className="transaction-info">
              <strong>{transaction.description}</strong>
              <span>{transaction.type.replace(/_/g, ' ')}</span>
            </p>

            <p className="transaction-value">
              <strong>
                {transaction.amount.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {transaction.currency}
              </strong>

              <small>{transaction.status}</small>
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}