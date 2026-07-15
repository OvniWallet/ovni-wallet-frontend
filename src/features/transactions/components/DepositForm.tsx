import { useState, type FormEvent } from 'react'
import { transactionsApi } from '@/api/transactions.api'
import { getApiError } from '@/api/errors'
import { parseToCents } from '@/lib/money'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ARS', 'BRL', 'JPY'] as const

interface DepositFormProps {
  onSuccess: () => void
}

export function DepositForm({ onSuccess }: DepositFormProps) {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>('ARS')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess(false)

    const amountInCents = parseToCents(amount)
    if (amountInCents === null) {
      setError('Ingresá un monto válido mayor a cero.')
      return
    }

    setLoading(true)

    try {
      await transactionsApi.deposit({ amount_in_cents: amountInCents, currency })
      setSuccess(true)
      setAmount('')
      onSuccess()
    } catch (err) {
      const { message } = getApiError(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form-card deposit-form" onSubmit={handleSubmit} noValidate>
      <header className="form-heading">
        <p>Fondeo simulado</p>
        <h2>Depositar dinero</h2>
        <span>Cargá saldo de prueba en la divisa que elijas.</span>
      </header>

      <label htmlFor="depositAmount">Monto</label>
      <input
        id="depositAmount"
        type="number"
        min="0.01"
        step="0.01"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="0.00"
      />

      <label htmlFor="depositCurrency">Divisa</label>
      <select
        id="depositCurrency"
        value={currency}
        onChange={(event) => setCurrency(event.target.value as (typeof CURRENCIES)[number])}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}
      {success && <p>Depósito realizado con éxito.</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Procesando...' : 'Depositar'}
      </button>
    </form>
  )
}
