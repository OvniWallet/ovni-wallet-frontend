import { Link } from 'react-router-dom'
import type { Transaction } from '../types'

interface TransactionTableProps {
  transactions?: Transaction[] 
  limit?: number
  showAllLink?: boolean
  loading?: boolean
}

const transactionIcons: Record<string, string> = {
  DEPOSIT: '↓',
  WITHDRAWAL: '↑',
  EXCHANGE: '⇄',
  P2P_TRANSFER: '↗',
  CARD_SPEND: '▣',
}

export function TransactionTable({
  transactions = [],
  limit,
  showAllLink = false,
  loading = false,
}: TransactionTableProps) {
  
  const visibleTransactions = limit ? transactions.slice(0, limit) : transactions

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

      {loading ? (
        <div className="transactions-loading">
          <p>Cargando movimientos...</p>
        </div>
      ) : (
        <div className="transaction-list">
          {visibleTransactions.length === 0 ? (
            <p className="no-transactions">No hay movimientos registrados.</p>
          ) : (
            visibleTransactions.map((transaction) => {
              // CLAVE: Nos aseguramos de que 'amount' sea un número válido antes de formatear
              const safeAmount = typeof transaction?.amount === 'number' ? transaction.amount : 0

              return (
                <article className="transaction-item" key={transaction.id}>
                  <span className="transaction-icon" aria-hidden="true">
                    {transactionIcons[transaction.type] ?? '•'}
                  </span>

                  <p className="transaction-info">
                    <strong>{transaction.description ?? 'Sin descripción'}</strong>
                    <span>{(transaction.type ?? '').replace(/_/g, ' ')}</span>
                  </p>

                  <p className="transaction-value">
                    <strong>
                      {safeAmount.toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      {transaction.currency ?? 'ARS'}
                    </strong>

                    <small>{transaction.status ?? 'PENDING'}</small>
                  </p>
                </article>
              )
            })
          )}
        </div>
      )}
    </section>
  )
}