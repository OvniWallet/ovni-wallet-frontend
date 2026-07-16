import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { exchangeService } from '../services/exchange.service'
import type { Currency, ExchangeQuote } from '../types'

const currencies: Currency[] = ['USD', 'ARS', 'EUR']

export function ExchangeForm() {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD')
  const [toCurrency, setToCurrency] = useState<Currency>('ARS')
  const [amount, setAmount] = useState('100')
  const [quote, setQuote] = useState<ExchangeQuote | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    exchangeService
      .getQuote({
        fromCurrency,
        toCurrency,
        amount: Number(amount) || 0,
      })
      .then((response) => {
        if (active) setQuote(response)
      })

    return () => {
      active = false
    }
  }, [fromCurrency, toCurrency, amount])

  const convertedAmount = useMemo(() => {
    if (!quote) return 0
    return (Number(amount) || 0) * quote.rate
  }, [amount, quote])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setSuccess('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const numericAmount = Number(amount)

    if (!numericAmount || numericAmount <= 0 || fromCurrency === toCurrency) {
      return
    }

    setLoading(true)
    setSuccess('')

    try {
      const response = await exchangeService.exchange({
        fromCurrency,
        toCurrency,
        amount: numericAmount,
      })

      setSuccess(
        `Conversión realizada: ${response.convertedAmount.toLocaleString(
          'es-AR',
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )} ${toCurrency}`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="exchange-card" onSubmit={handleSubmit}>
      <header className="form-heading">
        <p>Conversión de divisas</p>
        <h1>Exchange</h1>
        <span>Convertí tu saldo entre las monedas disponibles.</span>
      </header>

      <label htmlFor="fromAmount">Entregás</label>

      <section className="exchange-field">
        <input
          id="fromAmount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <select
          aria-label="Moneda de origen"
          value={fromCurrency}
          onChange={(event) =>
            setFromCurrency(event.target.value as Currency)
          }
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
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

      <label htmlFor="toAmount">Recibís</label>

      <section className="exchange-field">
        <input
          id="toAmount"
          value={convertedAmount.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          readOnly
        />

        <select
          aria-label="Moneda de destino"
          value={toCurrency}
          onChange={(event) =>
            setToCurrency(event.target.value as Currency)
          }
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </section>

      <section className="exchange-summary">
        <p>
          <span>Cotización</span>
          <strong>
            1 {fromCurrency} ={' '}
            {quote?.rate.toLocaleString('es-AR', {
              maximumFractionDigits: 4,
            }) ?? '—'}{' '}
            {toCurrency}
          </strong>
        </p>

        <p>
          <span>Comisión</span>
          <strong>Sin costo</strong>
        </p>
      </section>

      {success && <p className="form-message">{success}</p>}

      <button type="submit" disabled={loading || fromCurrency === toCurrency}>
        {loading ? 'Procesando conversión...' : 'Convertir saldo'}
      </button>
    </form>
  )
}