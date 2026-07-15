import { useState } from 'react'
import {
  exchangeApi,
  type ExchangeCurrency,
  type ExchangeQuoteResponse,
} from '@/api/exchange.api'
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
      setError('Ingresá un monto válido mayor a cero.')
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
    <section className="exchange-page">
      <header className="page-heading">
        <p>Cambio de moneda</p>
        <h1>Convertí tus saldos de forma simple.</h1>
        <span>Consultá la cotización antes de confirmar la operación.</span>
      </header>

      <div className="exchange-layout">
        <section className="exchange-card">
          <div className="exchange-currency-row">
            <label>
              <span>Desde</span>
              <select
                value={sourceCurrency}
                onChange={(event) => {
                  setSourceCurrency(event.target.value as ExchangeCurrency)
                  setQuote(null)
                }}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </label>

            <span className="exchange-arrow" aria-hidden="true">⇄</span>

            <label>
              <span>Hacia</span>
              <select
                value={targetCurrency}
                onChange={(event) => {
                  setTargetCurrency(event.target.value as ExchangeCurrency)
                  setQuote(null)
                }}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="exchange-amount-field" htmlFor="amount">
            <span>Monto a convertir</span>
            <span className="exchange-amount-control">
              <input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value)
                  setQuote(null)
                  setSuccess(false)
                }}
              />
              <strong>{sourceCurrency}</strong>
            </span>
          </label>

          {error && <p className="form-message form-message-error" role="alert">{error}</p>}
          {success && <p className="form-message form-message-success">¡Conversión realizada con éxito!</p>}

          {quote && (
            <section className="exchange-quote">
              <p>Vas a recibir</p>
              <strong>{formatMoney(quote.target_amount_cents, targetCurrency)}</strong>
              <span>1 {sourceCurrency} = {quote.rate_value} {targetCurrency}</span>
              {quote.rate_is_stale && (
                <small>La cotización proviene de caché y puede no estar completamente actualizada.</small>
              )}
            </section>
          )}

          <div className="exchange-actions">
            <button
              className="secondary-action-button"
              type="button"
              onClick={handleQuote}
              disabled={loadingQuote || !amount}
            >
              {loadingQuote ? 'Consultando...' : 'Consultar cotización'}
            </button>

            <button
              className="primary-action-button"
              type="button"
              onClick={handleExchange}
              disabled={!quote || loadingExchange}
            >
              {loadingExchange ? 'Procesando...' : 'Confirmar conversión'}
            </button>
          </div>
        </section>

        <aside className="exchange-info-card">
          <p>Conversión transparente</p>
          <h2>Revisá siempre la cotización antes de operar.</h2>
          <ul>
            <li>Elegí la moneda de origen y destino.</li>
            <li>Ingresá el monto que querés convertir.</li>
            <li>Confirmá únicamente después de revisar el resultado.</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}
