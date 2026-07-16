import { CreditCard, Lock } from 'lucide-react'
import type { VirtualCardData } from '../types'

interface VirtualCardProps {
  card: VirtualCardData
  loading: boolean
  selected: boolean
  onSelect: () => void
  onToggleStatus: () => void
}

export function VirtualCard({ card, loading, selected, onSelect, onToggleStatus }: VirtualCardProps) {
  const isBlocked = card.status === 'BLOCKED'

  const className = [
    'virtual-card',
    isBlocked ? 'virtual-card-blocked' : '',
    selected ? 'virtual-card-selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article
      className={className}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <header className="virtual-card-header">
        <span className="virtual-card-brand">
          <span aria-hidden="true">👽</span>
          Ovni Wallet
        </span>

        <CreditCard aria-hidden="true" size={26} />
      </header>

      <strong className="virtual-card-number">{card.masked_number}</strong>

      <footer className="virtual-card-footer">
        <span>
          <small>Divisa</small>
          <strong>{card.currency_default}</strong>
        </span>
      </footer>

      <p className="virtual-card-status">{isBlocked ? 'Tarjeta bloqueada' : 'Tarjeta activa'}</p>

      {!isBlocked && (
        <button
          className="secondary-button virtual-card-action"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggleStatus()
          }}
          disabled={loading}
        >
          <Lock size={18} />
          {loading ? 'Actualizando...' : 'Bloquear tarjeta'}
        </button>
      )}
    </article>
  )
}
