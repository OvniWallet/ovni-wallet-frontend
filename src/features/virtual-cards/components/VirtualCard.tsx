import { CreditCard, Lock, Unlock } from 'lucide-react'
import type { VirtualCardData } from '../types'

interface VirtualCardProps {
  card: VirtualCardData
  loading: boolean
  onToggleStatus: () => void
}

export function VirtualCard({
  card,
  loading,
  onToggleStatus,
}: VirtualCardProps) {
  const isBlocked = card.status === 'BLOCKED'

  return (
    <article
      className={
        isBlocked ? 'virtual-card virtual-card-blocked' : 'virtual-card'
      }
    >
      <header className="virtual-card-header">
        <span className="virtual-card-brand">
          <span aria-hidden="true">👽</span>
          Ovni Wallet
        </span>

        <CreditCard aria-hidden="true" size={26} />
      </header>

      <strong className="virtual-card-number">{card.maskedNumber}</strong>

      <footer className="virtual-card-footer">
        <span>
          <small>Titular</small>
          <strong>{card.cardholderName}</strong>
        </span>

        <span>
          <small>Vencimiento</small>
          <strong>{card.expirationDate}</strong>
        </span>
      </footer>

      <p className="virtual-card-status">
        {isBlocked ? 'Tarjeta bloqueada' : 'Tarjeta activa'}
      </p>

      <button
        className="secondary-button virtual-card-action"
        type="button"
        onClick={onToggleStatus}
        disabled={loading}
      >
        {isBlocked ? <Unlock size={18} /> : <Lock size={18} />}

        {loading
          ? 'Actualizando...'
          : isBlocked
            ? 'Desbloquear tarjeta'
            : 'Bloquear tarjeta'}
      </button>
    </article>
  )
}