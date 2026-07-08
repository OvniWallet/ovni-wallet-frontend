import { Link } from 'react-router-dom'

const actions = [
  { label: 'Exchange', path: '/exchange' },
  { label: 'Historial', path: '/transactions' },
  { label: 'Tarjetas', path: '/cards' },
  { label: 'Enviar Dinero', path: '/p2p' },
]

export function QuickActions() {
  return (
    <section>
      <h2>Acciones rápidas</h2>

      <div className="quick-actions">
        {actions.map(({ label, path }) => (
          <Link key={path} to={path}>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}