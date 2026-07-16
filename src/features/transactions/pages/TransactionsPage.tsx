import { useMemo, useState } from 'react'
import { TransactionTable } from '../components/TransactionTable'
import { DepositForm } from '../components/DepositForm'
import { useTransactions } from '../hooks/useTransactions'
import { getTransactionSummary } from '../lib/transactionSummary'
import { useWalletBalance } from '@/features/wallets/hooks/useWalletBalance'
import type { TransactionStatus, TransactionType } from '../types'

type TransactionFilter = 'ALL' | TransactionType
type StatusFilter = 'ALL' | TransactionStatus
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

const statusFilters: Array<{
  label: string
  value: StatusFilter
}> = [
  { label: 'Todos los estados', value: 'ALL' },
  { label: 'Completada', value: 'COMPLETED' },
  { label: 'Fallida', value: 'FAILED' },
  { label: 'Revertida', value: 'REVERSED' },
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
    status,
    setStatus,
    nextPage,
    prevPage,
    refetch,
  } = useTransactions({ initialLimit: 10 })

  const [showDeposit, setShowDeposit] = useState(false)
  const [currency, setCurrency] = useState<CurrencyFilter>('ALL')

  const { balances } = useWalletBalance()

  // Las divisas del filtro salen de la wallet real del usuario (todas las que
  // tiene configuradas), no solo de las que aparecen en la página de
  // movimientos ya cargada — así no se pierden opciones cuando los tipos
  // EXCHANGE/CARD_SPEND (que no exponen moneda en el listado) dominan la
  // página actual.
  const currencies = useMemo(() => {
    return balances.map((b) => b.currency).sort()
  }, [balances])

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

        <select
          aria-label="Filtrar por estado"
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusFilter)}
        >
          {statusFilters.map(({ label, value }) => (
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
