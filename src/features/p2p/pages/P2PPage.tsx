import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { p2pApi, type P2PCurrency } from '@/api/p2p.api'
import { getApiError } from '@/api/errors'
import { parseToCents } from '@/lib/money'

const ERROR_MESSAGES: Record<string, string> = {
  CANNOT_TRANSFER_TO_SELF: 'No puedes transferirte fondos a ti mismo.',
  RECIPIENT_NOT_FOUND: 'El usuario destinatario no está registrado.',
  INSUFFICIENT_FUNDS: 'No tienes saldo suficiente en esa divisa.',
  BALANCE_CONFIGURATION_ERROR: 'Hay un problema con la configuración de divisas de una de las cuentas.',
  INVALID_INPUT: 'Revisa los datos ingresados.',
}

export function P2PPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<P2PCurrency>('USD')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleTransfer = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !amount) return

    const amountInCents = parseToCents(amount)
    if (amountInCents === null) {
      setError('Ingresa un monto válido mayor a cero.')
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
    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
      <form className="auth-card" onSubmit={handleTransfer} style={{ width: '100%', maxWidth: '400px' }}>
        <h1>Enviar Dinero </h1>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#10B981' }}>
            <p>¡Transferencia enviada con éxito!</p>
            <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Redirigiendo al panel...</p>
          </div>
        ) : (
          <>
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
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as P2PCurrency)}
                style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
              >
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BRL">BRL</option>
                <option value="JPY">JPY</option>
              </select>
            </div>

            {error && <p role="alert" style={{ color: '#DC2626' }}>{error}</p>}

            <button className="auth-button" type="submit" disabled={loading} style={{ marginTop: '1.5rem' }}>
              {loading ? 'Procesando envío...' : `Enviar ${amount || '0'} ${currency}`}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', color: '#3B82F6', marginTop: '1rem', cursor: 'pointer', width: '100%' }}
            >
              Cancelar
            </button>
          </>
        )}
      </form>
    </div>
  )
}