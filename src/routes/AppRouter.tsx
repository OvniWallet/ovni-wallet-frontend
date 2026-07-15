import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { TransactionsPage } from '@/features/transactions/pages/TransactionsPage'
import { TransactionDetailPage } from '@/features/transactions/pages/TransactionDetailPage'
import { ExchangePage } from '@/features/exchange/pages/ExchangePage'
import { CardsPage } from '@/features/virtual-cards/pages/CardsPage'
import { ChatbotPage } from '@/features/chatbot/pages/ChatbotPage'
import { P2PPage } from '@/features/p2p/pages/P2PPage'

import { AppLayout } from '@/layouts/AppLayout'

import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailPage />} />
            <Route path="/exchange" element={<ExchangePage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/p2p" element={<P2PPage />} />
          </Route>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}