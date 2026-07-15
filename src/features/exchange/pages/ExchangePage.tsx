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

  const handleSwap = () => {
    setSourceCurrency(targetCurrency)
    setTargetCurrency(sourceCurrency)
    setQuote(null)
    setSuccess(false)
  }

  return (
    <section className="exchange-page">
      <section className="exchange-card">
        <header className="form-heading">
          <p>Conversión de divisas</p>
          <h1>Exchange</h1>
          <span>Convierte tus monedas de forma rápida.</span>
        </header>

        <label htmlFor="amount">Entregás</label>
        <section className="exchange-field">
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

          <select
            id="sourceCurrency"
            aria-label="Moneda de origen"
            value={sourceCurrency}
            onChange={(e) => setSourceCurrency(e.target.value as ExchangeCurrency)}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </section>

        <button
          className="exchange-swap"
          type="button"
          onClick={handleSwap}
          aria-label="Intercambiar monedas"
        >
          ⇅
        </button>

        <label htmlFor="targetCurrency">Recibís</label>
        <section className="exchange-field">
          <input
            value={quote ? formatMoney(quote.target_amount_cents, targetCurrency) : ''}
            placeholder="—"
            readOnly
          />

          <select
            id="targetCurrency"
            aria-label="Moneda de destino"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value as ExchangeCurrency)}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </section>

        {quote && (
          <section className="exchange-summary">
            <p>
              <span>Tasa</span>
              <strong>{quote.rate_value}</strong>
            </p>

            {quote.rate_is_stale && (
              <p>
                <span>⚠️ Tasa en caché</span>
                <strong>Puede no estar 100% actualizada</strong>
              </p>
            )}
          </section>
        )}

        {error && <p role="alert">{error}</p>}
        {success && <p className="form-message">¡Intercambio realizado con éxito!</p>}

        <button
          className="secondary-button"
          type="button"
          onClick={handleQuote}
          disabled={loadingQuote || !amount}
        >
          {loadingQuote ? 'Cotizando...' : 'Cotizar'}
        </button>

        <button
          type="button"
          onClick={handleExchange}
          disabled={!quote || loadingExchange}
        >
          {loadingExchange ? 'Procesando...' : 'Realizar intercambio'}
        </button>
      </section>

      <aside className="exchange-info">
        <p>Operación simple</p>
        <h2>Convertí tus monedas en pocos pasos.</h2>
        <span>
          Revisá la cotización estimada antes de confirmar la operación.
        </span>
      </aside>
    </section>
  )
}
