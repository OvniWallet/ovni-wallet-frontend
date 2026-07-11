import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

const availableBalances = [
  { currency: 'ARS', amount: '$125.000,50' },
  { currency: 'USD', amount: 'US$250,75' },
  { currency: 'EUR', amount: '€180,20' },
]

export function P2PPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleTransfer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email || !amount) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)

    try {
      const userSession = localStorage.getItem('user')
      let storageKey = 'ovni_transactions_guest'

      if (userSession) {
        const user = JSON.parse(userSession)
        storageKey = `ovni_transactions_${user.email || user.id || 'default'}`
      }

      const currentData = localStorage.getItem(storageKey)
      const transactions = currentData ? JSON.parse(currentData) : []

      const newTransfer = {
        id: `tx-${Date.now()}`,
        type: 'P2P_TRANSFER',
        status: 'COMPLETED',
        amount: Number(amount),
        currency,
        description: `Transferencia enviada a ${email}`,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(
        storageKey,
        JSON.stringify([newTransfer, ...transactions]),
      )

      window.dispatchEvent(new Event('update_wallet_history'))
    } catch (error) {
      console.error('Error guardando la transacción:', error)
    }

    setSuccess(true)

    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  }

  const submitText = loading
    ? 'Procesando envío...'
    : `Enviar ${amount || '0'} ${currency}`

  return (
    <main className="transfer-page">
      <form className="form-card transfer-card" onSubmit={handleTransfer}>
        <header className="form-heading">
          <p>Transferencias P2P</p>
          <h1>Enviar dinero</h1>
          <span>Transferí saldo a otro usuario de Ovni Wallet.</span>
        </header>

        {success && (
          <p className="form-message">
            <strong>Transferencia enviada con éxito</strong>
            <span>Redirigiendo al panel...</span>
          </p>
        )}

        {!success && (
          <fieldset className="transfer-fields">
            <label htmlFor="recipient">Email del destinatario</label>
            <input
              id="recipient"
              type="email"
              placeholder="amigo@correo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="amount">Monto</label>

            <section className="transfer-amount-row">
              <input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />

              <select
                aria-label="Moneda"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              >
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
                <option value="EUR">EUR</option>
              </select>
            </section>

            <button type="submit" disabled={loading}>
              {submitText}
            </button>

            <button
              className="link-button"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </button>
          </fieldset>
        )}
      </form>

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

        <dl className="transfer-balances">
          {availableBalances.map((balance) => (
            <span className="transfer-balance" key={balance.currency}>
              <dt>{balance.currency}</dt>
              <dd>{balance.amount}</dd>
            </span>
          ))}
        </dl>
      </aside>
    </main>
  )
}