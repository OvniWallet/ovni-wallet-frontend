import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { TransactionTable } from '../components/TransactionTable'
import { transactions } from '../mocks/transactions.mock'
import type { TransactionType } from '../types'

type TransactionFilter = 'ALL' | TransactionType
type CurrencyFilter = 'ALL' | string

const PAGE_SIZE = 5

const filters: Array<{ label: string; value: TransactionFilter }> = [
  { label: 'Todos los tipos', value: 'ALL' },
  { label: 'Depósitos', value: 'DEPOSIT' },
  { label: 'Transferencias', value: 'P2P_TRANSFER' },
  { label: 'Cambio de moneda', value: 'EXCHANGE' },
  { label: 'Tarjetas', value: 'CARD_SPEND' },
]

const currencies = ['ARS', 'USD', 'EUR', 'GBP', 'BRL', 'JPY']

export function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TransactionFilter>('ALL')
  const [currency, setCurrency] = useState<CurrencyFilter>('ALL')
  const [page, setPage] = useState(1)

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const matchesType = filter === 'ALL' || transaction.type === filter
      const matchesCurrency = currency === 'ALL' || transaction.currency === currency
      const matchesSearch =
        !normalizedSearch ||
        transaction.description.toLowerCase().includes(normalizedSearch) ||
        transaction.currency.toLowerCase().includes(normalizedSearch)

      return matchesType && matchesCurrency && matchesSearch
    })
  }, [currency, filter, search])

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * PAGE_SIZE
  const visibleTransactions = filteredTransactions.slice(start, start + PAGE_SIZE)
  const resetPage = () => setPage(1)

  return (
    <section className="transactions-page">
      <header className="page-heading">
        <p>Historial</p>
        <h1>Movimientos</h1>
        <span>Consultá y filtrá las operaciones realizadas en tu cuenta.</span>
      </header>

      <section className="transactions-toolbar">
        <label className="transactions-search" htmlFor="transactionSearch">
          <Search size={18} aria-hidden="true" />
          <input
            id="transactionSearch"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              resetPage()
            }}
            placeholder="Buscar por descripción o moneda"
          />
        </label>

        <select
          aria-label="Filtrar por tipo"
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value as TransactionFilter)
            resetPage()
          }}
        >
          {filters.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          aria-label="Filtrar por moneda"
          value={currency}
          onChange={(event) => {
            setCurrency(event.target.value)
            resetPage()
          }}
        >
          <option value="ALL">Todas las monedas</option>
          {currencies.map((currencyCode) => (
            <option key={currencyCode} value={currencyCode}>{currencyCode}</option>
          ))}
        </select>
      </section>

      <TransactionTable transactions={visibleTransactions} />

      <footer className="transactions-footer">
        <p className="transactions-count">
          {filteredTransactions.length}{' '}
          {filteredTransactions.length === 1 ? 'movimiento encontrado' : 'movimientos encontrados'}
        </p>

        <nav className="transactions-pagination" aria-label="Paginación">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Anterior
          </button>

          <span>Página {safePage} de {pageCount}</span>

          <button
            type="button"
            disabled={safePage === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            Siguiente
          </button>
        </nav>
      </footer>
    </section>
  )
}
