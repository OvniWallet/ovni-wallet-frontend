import { useState } from 'react'
import { exchangeApi, type ExchangeCurrency, type ExchangeQuoteResponse } from '@/api/exchange.api'
import { getApiError } from '@/api/errors'
import { parseToCents, formatMoney } from '@/lib/money'

const CURRENCIES: ExchangeCurrency[] = ['USD', 'EUR', 'GBP', 'ARS', 'BRL', 'JPY']

export function ExchangePage() {
  const [sourceCurrency, setSourceCurrency] = useState<ExchangeCurrency>('USD')
  const [targetCurrency, setTargetCurrency] = useState<ExchangeCurrency>('ARS')
  const [amount, setAmount] = useState('')
  const [quote, setQuote] = useState<ExchangeQuoteResponse | null>(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [loadingExchange, setLoadingExchange] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleQuote = async () => {
    setError('')
    setSuccess(false)
    const cents = parseToCents(amount)

    if (cents === null) {
      setError('Ingresa un monto válido mayor a cero.')
      return
    }

    setLoadingQuote(true)
    try {
      const result = await exchangeApi.getQuote({
        source_currency: sourceCurrency,
        target_currency: targetCurrency,
        source_amount_cents: cents,
      })
      setQuote(result)
    } catch (err) {
      const { message } = getApiError(err)
      setError(message)
      setQuote(null)
    } finally {
      setLoadingQuote(false)
    }
  }

  const handleExchange = async () => {
    const cents = parseToCents(amount)
    if (cents === null) return

    setLoadingExchange(true)
    setError('')

    try {
      await exchangeApi.createExchange({
        source_currency: sourceCurrency,
        target_currency: targetCurrency,
        source_amount_cents: cents,
      })
      setSuccess(true)
      setQuote(null)
      setAmount('')
    } catch (err) {
      const { message } = getApiError(err)
      setError(message)
    } finally {
      setLoadingExchange(false)
    }
  }

  return (
    <section style={{ padding: '2rem', maxWidth: '420px' }}>
      <h2>Exchange</h2>
      <p>Convierte tus monedas de forma rápida.</p>

      <label htmlFor="sourceCurrency">Desde</label>
      <select
        id="sourceCurrency"
        value={sourceCurrency}
        onChange={(e) => setSourceCurrency(e.target.value as ExchangeCurrency)}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label htmlFor="targetCurrency">Hacia</label>
      <select
        id="targetCurrency"
        value={targetCurrency}
        onChange={(e) => setTargetCurrency(e.target.value as ExchangeCurrency)}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label htmlFor="amount">Monto a convertir</label>
      <input
        id="amount"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value)
          setQuote(null)
        }}
      />

      {error && <p role="alert" style={{ color: '#DC2626' }}>{error}</p>}

      {quote && (
        <div style={{ margin: '1rem 0', padding: '0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }}>
          <p>Recibirás: <strong>{formatMoney(quote.target_amount_cents, targetCurrency)}</strong></p>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Tasa: {quote.rate_value}</p>
          {quote.rate_is_stale && (
            <p style={{ fontSize: '0.85rem', color: '#D97706' }}>
              ⚠️ Esta tasa proviene de caché (puede no estar 100% actualizada).
            </p>
          )}
        </div>
      )}

      {success && <p style={{ color: '#10B981' }}>¡Intercambio realizado con éxito!</p>}

      <button type="button" onClick={handleQuote} disabled={loadingQuote || !amount}>
        {loadingQuote ? 'Cotizando...' : 'Cotizar'}
      </button>

      <button
        type="button"
        onClick={handleExchange}
        disabled={!quote || loadingExchange}
        style={{ marginLeft: '0.5rem' }}
      >
        {loadingExchange ? 'Procesando...' : 'Realizar intercambio'}
      </button>
    </section>
  )
}