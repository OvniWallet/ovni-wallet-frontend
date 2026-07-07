import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { TransactionsPage } from '@/features/transactions/pages/TransactionsPage'
import { ExchangePage } from '@/features/exchange/pages/ExchangePage'
import { CardsPage } from '@/features/virtual-cards/pages/CardsPage'
import { ChatbotPage } from '@/features/chatbot/pages/ChatbotPage'

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
            <Route path="/exchange" element={<ExchangePage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}