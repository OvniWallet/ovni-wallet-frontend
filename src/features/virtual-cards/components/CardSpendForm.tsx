import { useState, type FormEvent } from 'react'
import { ShoppingBag } from 'lucide-react'
import { virtualCardsApi } from '@/api/virtualCards.api'
import { getApiError } from '@/api/errors'
import { parseToCents } from '@/lib/money'
import { useWalletBalance } from '@/features/wallets/hooks/useWalletBalance'
import type { VirtualCardData } from '../types'

interface CardSpendFormProps {
  card: VirtualCardData
}

export function CardSpendForm({ card }: CardSpendFormProps) {
  const { balances } = useWalletBalance()
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(card.currency_default)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const currencyOptions = balances.map((b) => b.currency)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!merchant.trim()) return

    const amountInCents = parseToCents(amount)
    if (amountInCents === null) {
      setError('Ingresá un monto válido mayor a cero.')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await virtualCardsApi.simulateSpend({
        card_id: card.card_id,
        amount_in_cents: amountInCents,
        currency,
        merchant_name: merchant,
      })

      setMessage(
        response.status === 'COMPLETED' ? 'Compra simulada correctamente.' : 'La operación fue rechazada.',
      )
      setMerchant('')
      setAmount('')
    } catch (err) {
      setError(getApiError(err).message)
    } finally {
      setLoading(false)
    }
  }

  const isBlocked = card.status === 'BLOCKED'

  return (
    <form className="form-card card-spend-form" onSubmit={handleSubmit}>
      <header className="form-heading">
        <p>Simulación</p>
        <h2>Probar una compra</h2>
        <span>Simulá un consumo usando la tarjeta seleccionada.</span>
      </header>

      <label htmlFor="merchant">Comercio</label>
      <input
        id="merchant"
        value={merchant}
        onChange={(event) => setMerchant(event.target.value)}
        placeholder="Nombre del comercio"
        required
      />

      <label htmlFor="cardAmount">Monto</label>
      <section className="transfer-amount-row">
        <input
          id="cardAmount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0,00"
          required
        />

        <select
          aria-label="Divisa"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
        >
          {currencyOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </section>

      {error && <p role="alert">{error}</p>}
      {message && <p className="form-message">{message}</p>}

      <button type="submit" disabled={loading || isBlocked}>
        <ShoppingBag size={18} />
        {isBlocked ? 'Tarjeta bloqueada' : loading ? 'Procesando compra...' : 'Simular compra'}
      </button>
    </form>
  )
}
