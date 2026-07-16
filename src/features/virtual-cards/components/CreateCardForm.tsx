import { useState, type FormEvent } from 'react'
import { virtualCardsApi } from '@/api/virtualCards.api'
import { getApiError } from '@/api/errors'
import { useWalletBalance } from '@/features/wallets/hooks/useWalletBalance'

interface CreateCardFormProps {
  onSuccess: () => void
}

export function CreateCardForm({ onSuccess }: CreateCardFormProps) {
  const { balances } = useWalletBalance()
  const [currency, setCurrency] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currencyOptions = balances.map((b) => b.currency)
  const selectedCurrency = currency || currencyOptions[0] || ''

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedCurrency) return

    setError('')
    setLoading(true)

    try {
      await virtualCardsApi.createCard({ currency_default: selectedCurrency })
      onSuccess()
    } catch (err) {
      const { code, message } = getApiError(err)
      setError(
        code === 'MAX_CARDS_REACHED'
          ? 'Ya alcanzaste el límite de 3 tarjetas por wallet.'
          : message,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form-card create-card-form" onSubmit={handleSubmit} noValidate>
      <header className="form-heading">
        <p>Nueva tarjeta</p>
        <h2>Emitir tarjeta virtual</h2>
        <span>Elegí la divisa por defecto de la tarjeta.</span>
      </header>

      <label htmlFor="newCardCurrency">Divisa</label>
      <select
        id="newCardCurrency"
        value={selectedCurrency}
        onChange={(event) => setCurrency(event.target.value)}
      >
        {currencyOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading || !selectedCurrency}>
        {loading ? 'Emitiendo...' : 'Emitir tarjeta'}
      </button>
    </form>
  )
}
