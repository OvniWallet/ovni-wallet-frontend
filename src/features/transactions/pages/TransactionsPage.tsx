import { useMemo, useState } from 'react'
import { TransactionTable } from '../components/TransactionTable'
import { DepositForm } from '../components/DepositForm'
import { useTransactions } from '../hooks/useTransactions'
import { getTransactionSummary } from '../lib/transactionSummary'
import type { TransactionType } from '../types'

type TransactionFilter = 'ALL' | TransactionType
type CurrencyFilter = 'ALL' | string

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
  const [currency, setCurrency] = useState<CurrencyFilter>('ALL')

  const currencies = useMemo(() => {
    const found = new Set<string>()
    transactions.forEach((transaction) => {
      const transactionCurrency = getTransactionSummary(transaction).currency
      if (transactionCurrency) found.add(transactionCurrency)
    })
    return Array.from(found).sort()
  }, [transactions])

  const visibleTransactions = useMemo(() => {
    if (currency === 'ALL') return transactions
    return transactions.filter(
      (transaction) => getTransactionSummary(transaction).currency === currency,
    )
  }, [transactions, currency])

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

        <select
          aria-label="Filtrar por moneda"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
        >
          <option value="ALL">Todas las monedas</option>
          {currencies.map((currencyCode) => (
            <option key={currencyCode} value={currencyCode}>{currencyCode}</option>
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

      <TransactionTable transactions={visibleTransactions} loading={loading} />

      {!loading && !error && (
        <p className="transactions-count">
          {visibleTransactions.length}{' '}
          {visibleTransactions.length === 1 ? 'movimiento encontrado' : 'movimientos encontrados'}
        </p>
      )}

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
