import type { Transaction } from '../types'

export const transactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'DEPOSIT',
    status: 'COMPLETED',
    amount: 500,
    currency: 'USD',
    description: 'Depósito inicial',
    createdAt: '2026-07-03T12:00:00Z',
  },
  {
    id: 'tx-2',
    type: 'EXCHANGE',
    status: 'COMPLETED',
    amount: 100,
    currency: 'USD',
    description: 'Conversión USD a ARS',
    createdAt: '2026-07-03T13:00:00Z',
  },
  {
    id: 'tx-3',
    type: 'P2P_TRANSFER',
    status: 'COMPLETED',
    amount: 25,
    currency: 'USD',
    description: 'Transferencia enviada',
    createdAt: '2026-07-03T14:00:00Z',
  },
]