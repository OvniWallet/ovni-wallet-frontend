import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, ArrowRightLeft } from 'lucide-react'
import { transactionsApi } from '@/api/transactions.api'
import { getApiError } from '@/api/errors'
import { formatMoney } from '@/lib/money'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getTransactionSummary, getTransactionDetailInfo } from '../lib/transactionSummary'
import type { TransactionDetail } from '../types'

const STATUS_LABEL: Record<string, string> = {
  COMPLETED: 'Completada',
  FAILED: 'Fallida',
  REVERSED: 'Revertida',
}

const TYPE_LABEL: Record<string, string> = {
  DEPOSIT: 'Depósito',
  P2P_TRANSFER: 'Transferencia P2P',
  EXCHANGE: 'Conversión de divisas',
  CARD_SPEND: 'Consumo con tarjeta',
}

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
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
  const detailInfo = getTransactionDetailInfo(transaction, user?.id ?? null)
  const statusClassName = `receipt-status receipt-status-${transaction.status.toLowerCase()}`

  return (
    <section className="transaction-detail-page">
      <Link to="/transactions" className="link-button">← Volver al historial</Link>

      <article className="receipt-card">
        <header className="receipt-header">
          <p className="section-eyebrow">{TYPE_LABEL[transaction.type] ?? transaction.type}</p>
          <h1>{summary.description}</h1>

          {summary.amount !== null && summary.currency !== null && (
            <strong className="receipt-amount">{formatMoney(summary.amount * 100, summary.currency)}</strong>
          )}

          <span className={statusClassName}>{STATUS_LABEL[transaction.status] ?? transaction.status}</span>
        </header>

        <dl className="receipt-meta">
          <div>
            <dt>Fecha</dt>
            <dd>{new Date(transaction.created_at).toLocaleString('es-AR')}</dd>
          </div>
          <div>
            <dt>Tipo</dt>
            <dd>{TYPE_LABEL[transaction.type] ?? transaction.type}</dd>
          </div>
        </dl>

        {detailInfo.counterparty && (
          <section className="receipt-section">
            <h2>
              <ArrowRightLeft size={16} aria-hidden="true" /> Origen y destino
            </h2>
            <dl className="receipt-meta">
              <div>
                <dt>Origen</dt>
                <dd>{detailInfo.counterparty.originLabel}</dd>
              </div>
              <div>
                <dt>Destino</dt>
                <dd>{detailInfo.counterparty.destinationLabel}</dd>
              </div>
            </dl>
          </section>
        )}

        {detailInfo.additionalInfo.length > 0 && (
          <section className="receipt-section">
            <h2>Información adicional</h2>
            <dl className="receipt-meta">
              {detailInfo.additionalInfo.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {detailInfo.geolocation && (
          <section className="receipt-section">
            <h2>
              <MapPin size={16} aria-hidden="true" /> Geolocalización
            </h2>
            <p className="receipt-geo">
              {detailInfo.geolocation.latitude.toFixed(5)}, {detailInfo.geolocation.longitude.toFixed(5)}
            </p>
          </section>
        )}

        <section className="receipt-section">
          <h2>Auditoría contable</h2>
          <p className="receipt-audit-id">ID de transacción: {transaction.transaction_id}</p>

          <table className="receipt-ledger">
            <thead>
              <tr>
                <th>Asiento</th>
                <th>Divisa</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {transaction.ledger_entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.type === 'DEBIT' ? 'Débito' : 'Crédito'}</td>
                  <td>{entry.currency}</td>
                  <td>{formatMoney(entry.amount_in_cents, entry.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>
    </section>
  )
}
