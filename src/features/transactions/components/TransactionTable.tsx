import { useState, useEffect } from 'react'
import type { Transaction } from '../types'
import { getLatestTransactions } from '../mocks/transactions.mock'

// Dejamos la interfaz vacía o limpia para que no te dé errores en otros archivos que llamen a <TransactionTable />
interface TransactionTableProps {
  transactions?: Transaction[]
}

// QUITAMOS el parámetro 'transactions' que no se usaba para eliminar la advertencia de TypeScript
export function TransactionTable({}: TransactionTableProps) {
  // Estado local que se refrescará automáticamente leyendo los mocks dinámicos
  const [history, setHistory] = useState<Transaction[]>(() => getLatestTransactions())

  useEffect(() => {
    // Sincronización inmediata al montar la tabla
    setHistory(getLatestTransactions())

    // REFRESCO INMORTAL: Revisa el localStorage cada 1000ms (1 segundo)
    const interval = setInterval(() => {
      setHistory(getLatestTransactions())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section>
      <h2>Últimos movimientos</h2>

      <div className="transaction-list">
        {history.map((transaction) => (
          <article className="transaction-item" key={transaction.id}>
            <div>
              <strong>{transaction.description}</strong>
              <p>{transaction.type}</p>
            </div>

            <div>
              <strong>
                {transaction.amount.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {transaction.currency}
              </strong>
              <p>{transaction.status}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}