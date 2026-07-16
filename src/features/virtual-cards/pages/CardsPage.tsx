import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { VirtualCard } from '../components/VirtualCard'
import { CreateCardForm } from '../components/CreateCardForm'
import { CardSpendForm } from '../components/CardSpendForm'
import { virtualCardsApi } from '@/api/virtualCards.api'
import { getApiError } from '@/api/errors'
import type { VirtualCardData } from '../types'

const MAX_CARDS = 3

export function CardsPage() {
  const [cards, setCards] = useState<VirtualCardData[]>([])
  const [loadingCards, setLoadingCards] = useState(true)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')

  const loadCards = () => {
    setLoadingCards(true)
    virtualCardsApi
      .getCards()
      .then((result) => {
        setCards(result)
        setSelectedCardId((current) => {
          if (current && result.some((c) => c.card_id === current)) return current
          return result[0]?.card_id ?? null
        })
      })
      .catch((err) => setError(getApiError(err).message))
      .finally(() => setLoadingCards(false))
  }

  useEffect(loadCards, [])

  const selectedCard = cards.find((c) => c.card_id === selectedCardId) ?? null

  const handleToggleStatus = async (cardId: string) => {
    setActionLoading(true)
    setError('')

    try {
      await virtualCardsApi.blockCard(cardId)
      loadCards()
    } catch (err) {
      setError(getApiError(err).message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loadingCards) {
    return <p className="page-state">Cargando tarjetas virtuales...</p>
  }

  return (
    <section className="cards-page">
      <header className="page-heading">
        <p>Tarjetas virtuales</p>
        <h1>Administrá tus tarjetas</h1>
        <span>Emití hasta 3 tarjetas, controlá su estado y probá consumos.</span>
      </header>

      {error && <p role="alert">{error}</p>}

      <div className="virtual-cards-column">
        {cards.length === 0 ? (
          <p className="page-state">Todavía no tenés tarjetas virtuales.</p>
        ) : (
          <div className="virtual-cards-grid">
            {cards.map((card) => (
              <VirtualCard
                key={card.card_id}
                card={card}
                loading={actionLoading}
                selected={card.card_id === selectedCardId}
                onSelect={() => setSelectedCardId(card.card_id)}
                onToggleStatus={() => handleToggleStatus(card.card_id)}
              />
            ))}
          </div>
        )}

        {cards.length < MAX_CARDS && (
          <section className="cards-create-toggle">
            <button type="button" onClick={() => setShowCreateForm((prev) => !prev)}>
              <Plus size={18} />
              {showCreateForm ? 'Cerrar' : 'Nueva tarjeta'}
            </button>

            {showCreateForm && (
              <CreateCardForm
                onSuccess={() => {
                  setShowCreateForm(false)
                  loadCards()
                }}
              />
            )}
          </section>
        )}
      </div>

      {selectedCard && <CardSpendForm card={selectedCard} />}
    </section>
  )
}
