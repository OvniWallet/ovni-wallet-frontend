import { DashboardHeader } from '../components/DashboardHeader'
import { QuickActions } from '../components/QuickActions'
import { WalletsDashboard } from '@/features/wallets/pages/WalletsDashboard'
import { TransactionTable } from '@/features/transactions/components/TransactionTable'
import { transactions } from '@/features/transactions/mocks/transactions.mock'

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <WalletsDashboard />
      <TransactionTable transactions={transactions} />
      <QuickActions />
    </div>
  )
}