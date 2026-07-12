import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { TransactionTable } from '../components/TransactionTable'
import { transactions } from '../mocks/transactions.mock'
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
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TransactionFilter>('ALL')

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return transactions.filter((transaction) => {
      const matchesType =
        filter === 'ALL' || transaction.type === filter

      const matchesSearch =
        !normalizedSearch ||
        transaction.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        transaction.currency
          .toLowerCase()
          .includes(normalizedSearch)

      return matchesType && matchesSearch
    })
  }, [filter, search])

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
            placeholder="Buscar por descripción o moneda"
          />
        </label>

        <select
          aria-label="Filtrar movimientos"
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as TransactionFilter)
          }
        >
          {filters.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </section>

      <TransactionTable transactions={filteredTransactions} />

      <p className="transactions-count">
        {filteredTransactions.length}{' '}
        {filteredTransactions.length === 1
          ? 'movimiento encontrado'
          : 'movimientos encontrados'}
      </p>
    </section>
  )
}