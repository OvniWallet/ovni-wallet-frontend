import { useEffect, useState, type FormEvent } from 'react'
import { ShoppingBag } from 'lucide-react'
import { VirtualCard } from '../components/VirtualCard'
import { virtualCardsService } from '../services/virtual-cards.service'
import type { VirtualCardData } from '../types'

export function CardsPage() {
  const [card, setCard] = useState<VirtualCardData | null>(null)
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    virtualCardsService.getCard().then(setCard)
  }, [])

  const handleToggleStatus = async () => {
    if (!card) return

    setLoading(true)
    setMessage('')

    try {
      const updatedCard = await virtualCardsService.updateStatus({
        cardId: card.id,
        status: card.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
      })

      setCard(updatedCard)
    } finally {
      setLoading(false)
    }
  }

  const handleSpend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!card || !merchant.trim() || Number(amount) <= 0) return

    setLoading(true)
    setMessage('')

    try {
      const response = await virtualCardsService.simulateSpend({
        cardId: card.id,
        amount: Number(amount),
        currency: card.currency,
        merchant,
      })

      setMessage(
        response.status === 'COMPLETED'
          ? 'Compra simulada correctamente.'
          : 'La operación fue rechazada.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (!card) {
    return <p className="page-state">Cargando tarjeta virtual...</p>
  }

  return (
    <section className="cards-page">
      <header className="page-heading">
        <p>Tarjetas virtuales</p>
        <h1>Administrá tu tarjeta</h1>
        <span>
          Controlá su estado y probá consumos antes de conectarla al backend.
        </span>
      </header>

      <VirtualCard
        card={card}
        loading={loading}
        onToggleStatus={handleToggleStatus}
      />

      <form className="form-card card-spend-form" onSubmit={handleSpend}>
        <header className="form-heading">
          <p>Simulación</p>
          <h2>Probar una compra</h2>
          <span>Simulá un consumo usando tu tarjeta virtual.</span>
        </header>

        <label htmlFor="merchant">Comercio</label>
        <input
          id="merchant"
          value={merchant}
          onChange={(event) => setMerchant(event.target.value)}
          placeholder="Nombre del comercio"
          required
        />

        <label htmlFor="cardAmount">Monto</label>
        <input
          id="cardAmount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0,00"
          required
        />

        {message && <p className="form-message">{message}</p>}

        <button type="submit" disabled={loading || card.status === 'BLOCKED'}>
          <ShoppingBag size={18} />

          {card.status === 'BLOCKED'
            ? 'Tarjeta bloqueada'
            : loading
              ? 'Procesando compra...'
              : 'Simular compra'}
        </button>
      </form>
    </section>
  )
}