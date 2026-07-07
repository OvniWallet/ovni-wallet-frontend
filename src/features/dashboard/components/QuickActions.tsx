import { Link } from 'react-router-dom'

export function QuickActions() {
  return (
    <section>
      <h2>Acciones rápidas</h2>

      <nav>
        <ul>
          <li><Link to="/exchange">Exchange</Link></li>
          <li><Link to="/transactions">Historial</Link></li>
          <li><Link to="/cards">Tarjetas</Link></li>
          <li><Link to="/chatbot">Chatbot</Link></li>
        </ul>
      </nav>
    </section>
  )
}