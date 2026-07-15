import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { p2pApi, type P2PCurrency } from '@/api/p2p.api'
import { getApiError } from '@/api/errors'
import { parseToCents } from '@/lib/money'

const ERROR_MESSAGES: Record<string, string> = {
  CANNOT_TRANSFER_TO_SELF: 'No podés transferirte fondos a vos mismo.',
  RECIPIENT_NOT_FOUND: 'El usuario destinatario no está registrado.',
  INSUFFICIENT_FUNDS: 'No tenés saldo suficiente en esa moneda.',
  BALANCE_CONFIGURATION_ERROR: 'Hay un problema con la configuración de divisas de una de las cuentas.',
  INVALID_INPUT: 'Revisá los datos ingresados.',
}

type TransferMode = 'send' | 'receive'

export function P2PPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<TransferMode>('send')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<P2PCurrency>('USD')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleTransfer = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!email || !amount) return

    const amountInCents = parseToCents(amount)
    if (amountInCents === null) {
      setError('Ingresá un monto válido mayor a cero.')
      return
    }

    setLoading(true)

    try {
      await p2pApi.transfer({
        recipient_email: email,
        amount_in_cents: amountInCents,
        currency,
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      const { code, message } = getApiError(err)
      setError(ERROR_MESSAGES[code] ?? message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="p2p-page">
      <header className="page-heading">
        <p>Transferencias P2P</p>
        <h1>Mové dinero entre usuarios de Ovni Wallet.</h1>
        <span>Elegí si querés enviar saldo o consultar tus datos para recibirlo.</span>
      </header>

      {mode === 'send' ? (
        <div className="p2p-layout">
          <div className="p2p-main-column">
            <div className="p2p-tabs" role="tablist" aria-label="Tipo de transferencia">
              <button
                type="button"
                role="tab"
                aria-selected={true}
                className="p2p-tab p2p-tab-active" 
                onClick={() => setMode('send')}
              >
                Enviar dinero
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={false}
                className="p2p-tab" 
                onClick={() => setMode('receive')}
              >
                Recibir dinero
              </button>
            </div>

            <form className="p2p-card" onSubmit={handleTransfer}>
            <div>
              <p className="section-eyebrow">Enviar saldo</p>
              <h2>Completá los datos del destinatario.</h2>
            </div>

            {success ? (
              <div className="p2p-success">
                <strong>¡Transferencia enviada con éxito!</strong>
                <span>Te estamos redirigiendo al panel.</span>
              </div>
            ) : (
              <>
                <label htmlFor="recipient">
                  <span>Email del destinatario</span>
                  <input
                    id="recipient"
                    type="email"
                    placeholder="amigo@correo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>

                <label htmlFor="transferAmount">
                  <span>Monto</span>
                  <span className="p2p-amount-control">
                    <input
                      id="transferAmount"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      required
                    />

                    <select
                      aria-label="Moneda"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value as P2PCurrency)}
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="BRL">BRL</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </span>
                </label>

                {error && <p className="form-message form-message-error" role="alert">{error}</p>}

                <button className="primary-action-button" type="submit" disabled={loading}>
                  {loading ? 'Procesando envío...' : `Enviar ${amount || '0'} ${currency}`}
                </button>

                <button className="text-action-button" type="button" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </button>
              </>
            )}
            </form>
          </div>

          <aside className="p2p-info-card">
            <p>Transferencias seguras</p>
            <h2>Revisá los datos antes de confirmar.</h2>
            <ul>
              <li>Verificá el correo del destinatario.</li>
              <li>Elegí la moneda correcta.</li>
              <li>La operación quedará registrada en Movimientos.</li>
            </ul>
          </aside>
        </div>
      ) : (
        <div className="p2p-main-column">
          <div className="p2p-tabs" role="tablist" aria-label="Tipo de transferencia">
            <button
              type="button"
              role="tab"
              aria-selected={false}
              className="p2p-tab" 
              onClick={() => setMode('send')}
            >
              Enviar dinero
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={true}
              className="p2p-tab p2p-tab-active" 
              onClick={() => setMode('receive')}
            >
              Recibir dinero
            </button>
          </div>

          <section className="receive-card">
          <div className="receive-content">
            <p className="section-eyebrow">Recibir saldo</p>
            <h2>Compartí tus datos para recibir dinero.</h2>
            <p>
              Por ahora podés utilizar el correo asociado a tu cuenta. El código QR se incorporará cuando el backend defina el identificador de cobro.
            </p>

            <div className="receive-data">
              <span>Dato de recepción</span>
              <strong>Tu correo registrado en Ovni Wallet</strong>
            </div>
          </div>

          <div className="receive-qr-placeholder" aria-label="Código QR pendiente">
            <span aria-hidden="true">▦</span>
            <strong>QR próximamente</strong>
            <small>Preparado para la integración del equipo.</small>
          </div>
          </section>
        </div>
      )}
    </section>
  )
}