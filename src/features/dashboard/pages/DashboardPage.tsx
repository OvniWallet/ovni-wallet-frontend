import { DashboardHeader } from '../components/DashboardHeader'
import { WalletsDashboard } from '@/features/wallets/pages/WalletsDashboard'
import { TransactionTable } from '@/features/transactions/components/TransactionTable'

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <WalletsDashboard />
      <TransactionTable limit={3} showAllLink />
    </div>
  )
}