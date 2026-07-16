import { useEffect, useState, type FormEvent } from 'react'
import { ShoppingBag } from 'lucide-react'
import { VirtualCard } from '../components/VirtualCard'
import { virtualCardsApi } from '@/api/virtualCards.api'
import { getApiError } from '@/api/errors'
import { parseToCents } from '@/lib/money'
import type { VirtualCardData } from '../types'

export function CardsPage() {
  const [cards, setCards] = useState<VirtualCardData[]>([])
  const [loadingCards, setLoadingCards] = useState(true)
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadCards = () => {
    setLoadingCards(true)
    virtualCardsApi
      .getCards()
      .then(setCards)
      .catch((err) => setError(getApiError(err).message))
      .finally(() => setLoadingCards(false))
  }

  useEffect(loadCards, [])

  const card = cards[0] ?? null

  const handleCreateCard = async () => {
    setActionLoading(true)
    setError('')

    try {
      await virtualCardsApi.createCard({ currency_default: 'USD' })
      loadCards()
    } catch (err) {
      setError(getApiError(err).message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!card) return

    setActionLoading(true)
    setMessage('')
    setError('')

    try {
      if (card.status === 'ACTIVE') {
        await virtualCardsApi.blockCard(card.card_id)
      }
      loadCards()
    } catch (err) {
      setError(getApiError(err).message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSpend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!card || !merchant.trim()) return

    const amountInCents = parseToCents(amount)
    if (amountInCents === null) {
      setError('Ingresá un monto válido mayor a cero.')
      return
    }

    setActionLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await virtualCardsApi.simulateSpend({
        card_id: card.card_id,
        amount_in_cents: amountInCents,
        currency: card.currency_default,
        merchant_name: merchant,
      })

      setMessage(
        response.status === 'COMPLETED' ? 'Compra simulada correctamente.' : 'La operación fue rechazada.',
      )
    } catch (err) {
      setError(getApiError(err).message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loadingCards) {
    return <p className="page-state">Cargando tarjeta virtual...</p>
  }

  if (!card) {
    return (
      <section className="cards-page">
        <header className="page-heading">
          <p>Tarjetas virtuales</p>
          <h1>Todavía no tenés una tarjeta</h1>
        </header>

        {error && <p role="alert">{error}</p>}

        <button type="button" onClick={handleCreateCard} disabled={actionLoading}>
          {actionLoading ? 'Creando...' : 'Emitir tarjeta virtual'}
        </button>
      </section>
    )
  }

  return (
    <section className="cards-page">
      <header className="page-heading">
        <p>Tarjetas virtuales</p>
        <h1>Administrá tu tarjeta</h1>
        <span>Controlá su estado y probá consumos.</span>
      </header>

      {error && <p role="alert">{error}</p>}

      <VirtualCard card={card} loading={actionLoading} onToggleStatus={handleToggleStatus} />

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

        <button type="submit" disabled={actionLoading || card.status === 'BLOCKED'}>
          <ShoppingBag size={18} />
          {card.status === 'BLOCKED'
            ? 'Tarjeta bloqueada'
            : actionLoading
              ? 'Procesando compra...'
              : 'Simular compra'}
        </button>
      </form>
    </section>
  )
}
