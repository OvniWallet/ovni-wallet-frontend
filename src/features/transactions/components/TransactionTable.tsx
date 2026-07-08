import { useState, useEffect } from 'react'
import type { Transaction } from '../types'
import { getLatestTransactions } from '../mocks/transactions.mock'

interface TransactionTableProps {
  transactions?: Transaction[] // Sigue siendo opcional por compatibilidad
}

// Limpiamos la prop que no se usa para quitar la advertencia de TypeScript
export function TransactionTable({ transactions }: TransactionTableProps) {
  // Inicializamos el estado directamente con el mock dinámico que lee el localStorage por usuario
  const [history, setHistory] = useState<Transaction[]>(() => {
    // Si por alguna razón el padre pasa transacciones directas, las usamos; si no, vamos al mock por usuario
    return transactions && transactions.length > 0 ? transactions : getLatestTransactions()
  })

  useEffect(() => {
    const handleHistoryUpdate = () => {
      setHistory(getLatestTransactions())
    }

    // Escuchamos el evento autónomo para actualizar en tiempo real
    window.addEventListener('update_wallet_history', handleHistoryUpdate)
    
    // Si cambian las props o se monta el componente, sincronizamos con lo último
    setHistory(getLatestTransactions())

    return () => {
      window.removeEventListener('update_wallet_history', handleHistoryUpdate)
    }
  }, [transactions])

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