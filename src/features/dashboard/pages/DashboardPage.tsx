import { WalletsDashboard } from '@/features/wallets/pages/WalletsDashboard'
import { DashboardHeader } from '../components/DashboardHeader'

export function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <WalletsDashboard />
    </>
  )
}