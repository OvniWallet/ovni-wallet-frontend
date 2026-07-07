import { DashboardHeader } from '../components/DashboardHeader'
import { WalletsDashboard } from '@/features/wallets/pages/WalletsDashboard'

export function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <WalletsDashboard />
    </>
  )
}