import { ExchangeForm } from '../components/ExchangeForm'

export function ExchangePage() {
  return (
    <section className="exchange-page">
      <ExchangeForm />

      <aside className="exchange-info">
        <p>Operación simple</p>
        <h2>Convertí tus monedas en pocos pasos.</h2>
        <span>
          Revisá la cotización estimada antes de confirmar la operación.
        </span>
      </aside>
    </section>
  )
}