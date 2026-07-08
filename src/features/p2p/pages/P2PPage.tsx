// src/features/p2p/pages/P2PPage.tsx
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function P2PPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleTransfer = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !amount) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)

    try {
      // 1. Obtener de forma dinámica el identificador del usuario logueado actualmente
      const userSession = localStorage.getItem('user')
      let storageKey = 'ovni_transactions_guest'
      
      if (userSession) {
        const user = JSON.parse(userSession)
        storageKey = `ovni_transactions_${user.email || user.id || 'default'}`
      }

      // 2. Traer el historial específico de ESTE usuario activo
      const currentData = localStorage.getItem(storageKey)
      const list = currentData ? JSON.parse(currentData) : []
      
      // Objeto estructurado de la transacción
      const newTransfer = {
        id: `tx-${Date.now()}`,
        type: 'P2P_TRANSFER',
        status: 'COMPLETED',
        amount: parseFloat(amount),
        currency: currency,
        description: `Transferencia enviada a ${email}`,
        createdAt: new Date().toISOString(),
      }

      // 3. Guardar el nuevo registro en la llave exclusiva del usuario
      localStorage.setItem(storageKey, JSON.stringify([newTransfer, ...list]))

      // 4. ¡MAGIA AUTÓNOMA! Disparamos el evento para que la tabla de movimientos se actualice sola sin recargar
      window.dispatchEvent(new Event('update_wallet_history'))

    } catch (err) {
      console.error("Error guardando la transacción:", err)
    }

    setSuccess(true)

    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
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
                onChange={(e) => setCurrency(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
              >
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

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