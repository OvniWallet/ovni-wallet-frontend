import { useState } from 'react'
import { TransactionTable } from '../components/TransactionTable'
import { DepositForm } from '../components/DepositForm'
import { useTransactions } from '../hooks/useTransactions'
import type { TransactionType } from '../types'

type TransactionFilter = 'ALL' | TransactionType

const filters: Array<{
  label: string
  value: TransactionFilter
}> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Depósitos', value: 'DEPOSIT' },
  { label: 'Transferencias', value: 'P2P_TRANSFER' },
  { label: 'Exchange', value: 'EXCHANGE' },
  { label: 'Tarjetas', value: 'CARD_SPEND' },
]

export function TransactionsPage() {
  const {
    transactions,
    loading,
    error,
    hasNext,
    hasPrev,
    type,
    setType,
    nextPage,
    prevPage,
    refetch,
  } = useTransactions({ initialLimit: 10 })

  const [showDeposit, setShowDeposit] = useState(false)

  return (
    <section className="transactions-page">
      <header className="page-heading">
        <p>Historial</p>
        <h1>Movimientos</h1>
        <span>
          Consultá y filtrá las operaciones realizadas en tu cuenta.
        </span>
      </header>

      <section className="transactions-deposit-toggle">
        <button type="button" onClick={() => setShowDeposit((prev) => !prev)}>
          {showDeposit ? 'Cerrar' : 'Depositar dinero'}
        </button>

        {showDeposit && (
          <DepositForm
            onSuccess={() => {
              setShowDeposit(false)
              refetch()
            }}
          />
        )}
      </section>

      <section className="transactions-toolbar">
        <select
          aria-label="Filtrar movimientos"
          value={type}
          onChange={(event) => setType(event.target.value as TransactionFilter)}
        >
          {filters.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </section>

      {error && (
        <div className="transactions-error">
          <p>{error}</p>
          <button type="button" onClick={refetch} className="btn-retry">
            Reintentar
          </button>
        </div>
      )}

      <TransactionTable transactions={transactions} loading={loading} />

      {!loading && !error && (hasNext || hasPrev) && (
        <div className="transactions-pagination">
          <button type="button" onClick={prevPage} disabled={!hasPrev} className="pagination-btn">
            Anterior
          </button>

          <button type="button" onClick={nextPage} disabled={!hasNext} className="pagination-btn">
            Siguiente
          </button>
        </div>
      )}
    </section>
  )
}
