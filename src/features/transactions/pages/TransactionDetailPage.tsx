import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { transactionsApi } from '@/api/transactions.api'
import { getApiError } from '@/api/errors'
import { formatMoney } from '@/lib/money'
import { getTransactionSummary } from '../lib/transactionSummary'
import type { TransactionDetail } from '../types'

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    let active = true
    setLoading(true)
    setError('')

    transactionsApi
      .getTransactionById(id)
      .then((data) => {
        if (active) setTransaction(data)
      })
      .catch((err) => {
        if (active) setError(getApiError(err).message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  if (loading) return <p className="page-state">Cargando comprobante...</p>
  if (error) return <p className="page-state" role="alert">{error}</p>
  if (!transaction) return null

  const summary = getTransactionSummary(transaction)

  return (
    <section className="transaction-detail-page">
      <Link to="/transactions">← Volver al historial</Link>

      <header className="page-heading">
        <p>Comprobante</p>
        <h1>{summary.description}</h1>
        <span>{transaction.type.replace(/_/g, ' ')} · {transaction.status}</span>
      </header>

      <dl className="transaction-detail-meta">
        <div>
          <dt>ID de auditoría</dt>
          <dd>{transaction.transaction_id}</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>{new Date(transaction.created_at).toLocaleString('es-AR')}</dd>
        </div>
      </dl>

      <table className="transaction-detail-ledger">
        <thead>
          <tr>
            <th>Tipo de asiento</th>
            <th>Divisa</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {transaction.ledger_entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.type}</td>
              <td>{entry.currency}</td>
              <td>{formatMoney(entry.amount_in_cents, entry.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
