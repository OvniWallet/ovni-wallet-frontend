import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { p2pApi, type P2PCurrency } from '@/api/p2p.api'
import { getApiError } from '@/api/errors'
import { parseToCents, formatMoney } from '@/lib/money'
import { useWalletBalance } from '@/features/wallets/hooks/useWalletBalance'

const ERROR_MESSAGES: Record<string, string> = {
  CANNOT_TRANSFER_TO_SELF: 'No puedes transferirte fondos a ti mismo.',
  RECIPIENT_NOT_FOUND: 'El usuario destinatario no está registrado.',
  INSUFFICIENT_FUNDS: 'No tienes saldo suficiente en esa divisa.',
  BALANCE_CONFIGURATION_ERROR: 'Hay un problema con la configuración de divisas de una de las cuentas.',
  INVALID_INPUT: 'Revisa los datos ingresados.',
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  ARS: '$',
  USD: 'US$',
  EUR: '€',
}

type Step = 'FORM' | 'CONFIRM' | 'DONE'

export function P2PPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('FORM')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<P2PCurrency>('USD')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { balances, loading: balancesLoading } = useWalletBalance()

  const handleReview = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !amount) return

    if (parseToCents(amount) === null) {
      setError('Ingresa un monto válido mayor a cero.')
      return
    }

    setStep('CONFIRM')
  }

  const handleConfirm = async () => {
    const amountInCents = parseToCents(amount)
    if (amountInCents === null) return

    setLoading(true)
    setError('')

    try {
      await p2pApi.transfer({
        recipient_email: email,
        amount_in_cents: amountInCents,
        currency,
      })

      setStep('DONE')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      const { code, message } = getApiError(err)
      setError(ERROR_MESSAGES[code] ?? message)
      setStep('FORM')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="transfer-page">
      <section className="form-card transfer-card">
        <header className="form-heading">
          <p>Transferencias P2P</p>
          <h1>Enviar dinero</h1>
          <span>Transferí saldo a otro usuario de Ovni Wallet.</span>
        </header>

        {step === 'DONE' && (
          <p className="form-message">
            <strong>¡Transferencia enviada con éxito!</strong>
            <span>Redirigiendo al panel...</span>
          </p>
        )}

        {step === 'FORM' && (
          <form className="transfer-fields" onSubmit={handleReview}>
            <label htmlFor="recipient">Email del destinatario</label>
            <input
              id="recipient"
              type="email"
              placeholder="amigo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="amount">Monto</label>
            <section className="transfer-amount-row">
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <select
                aria-label="Moneda"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as P2PCurrency)}
              >
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BRL">BRL</option>
                <option value="JPY">JPY</option>
              </select>
            </section>

            {error && <p role="alert">{error}</p>}

            <button type="submit">Revisar envío</button>

            <button
              className="link-button"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </button>
          </form>
        )}

        {step === 'CONFIRM' && (
          <div className="transfer-fields">
            <p>Confirmá los datos antes de enviar:</p>

            <dl>
              <div>
                <dt>Destinatario</dt>
                <dd>{email}</dd>
              </div>
              <div>
                <dt>Monto</dt>
                <dd>{formatMoney(parseToCents(amount) ?? 0, currency)}</dd>
              </div>
            </dl>

            {error && <p role="alert">{error}</p>}

            <button type="button" onClick={handleConfirm} disabled={loading}>
              {loading ? 'Procesando envío...' : 'Confirmar y enviar'}
            </button>

            <button
              className="link-button"
              type="button"
              onClick={() => setStep('FORM')}
              disabled={loading}
            >
              Editar datos
            </button>
          </div>
        )}
      </section>

      <aside className="transfer-info">
        <p>Transferencias seguras</p>
        <h2>Enviá dinero de forma simple.</h2>

        <span>
          Utilizá el correo del destinatario para transferir entre usuarios de
          Ovni Wallet. Revisá los datos antes de confirmar.
        </span>

        <ul className="transfer-tips">
          <li>Verificá el correo del destinatario.</li>
          <li>Elegí correctamente la moneda.</li>
          <li>La operación aparecerá en tu historial.</li>
        </ul>

        <h3>Saldos disponibles</h3>

        {balancesLoading && <p>Cargando saldos...</p>}

        {!balancesLoading && (
          <dl className="transfer-balances">
            {balances.map((b) => (
              <span className="transfer-balance" key={b.currency}>
                <dt>{b.currency}</dt>
                <dd>
                  {CURRENCY_SYMBOLS[b.currency] ?? ''}
                  {b.amount.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </dd>
              </span>
            ))}
          </dl>
        )}
      </aside>
    </main>
  )
}
