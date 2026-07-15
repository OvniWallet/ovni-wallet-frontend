import { Search } from 'lucide-react'
import { TransactionTable } from '../components/TransactionTable'
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
    page,
    totalPages,
    totalItems,
    type,
    search,
    setType,
    setSearch,
    nextPage,
    prevPage,
    refetch,
  } = useTransactions({ initialLimit: 10 }) // Define aquí la cantidad de registros por página

  return (
    <section className="transactions-page">
      <header className="page-heading">
        <p>Historial</p>
        <h1>Movimientos</h1>
        <span>
          Consultá y filtrá las operaciones realizadas en tu cuenta.
        </span>
      </header>

      <section className="transactions-toolbar">
        <label className="transactions-search" htmlFor="transactionSearch">
          <Search size={18} aria-hidden="true" />

          <input
            id="transactionSearch"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por descripción..."
          />
        </label>

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

      {/* Paginación */}
      {!loading && !error && totalPages > 1 && (
        <div className="transactions-pagination">
          <button 
            type="button" 
            onClick={prevPage} 
            disabled={page === 1}
            className="pagination-btn"
          >
            Anterior
          </button>
          
          <span className="pagination-info">
            Página {page} de {totalPages}
          </span>

          <button 
            type="button" 
            onClick={nextPage} 
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}

      <p className="transactions-count">
        {totalItems}{' '}
        {totalItems === 1
          ? 'movimiento encontrado'
          : 'movimientos encontrados'}
      </p>
    </section>
  )
}