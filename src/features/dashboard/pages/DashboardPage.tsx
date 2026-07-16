import { DashboardHeader } from '../components/DashboardHeader'
import { WalletsDashboard } from '@/features/wallets/pages/WalletsDashboard'
import { TransactionTable } from '@/features/transactions/components/TransactionTable'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'

export function DashboardPage() {
  // Consumimos el hook real limitando la búsqueda a las últimas 3 transacciones para el inicio
  const { transactions, loading, error } = useTransactions({ initialLimit: 3 })

  return (
    <div className="dashboard-page">
      <DashboardHeader />
      
      <WalletsDashboard />
      
      {/* Le pasamos las transacciones reales de la API, el estado de carga 
        y el límite correspondiente (3) al componente de la tabla.
      */}
      <TransactionTable 
        transactions={transactions} 
        loading={loading} 
        limit={3} 
        showAllLink 
      />

      {error && (
        <div className="dashboard-error-message" style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>
          <p>No se pudieron cargar tus últimos movimientos.</p>
        </div>
      )}
    </div>
  )
}