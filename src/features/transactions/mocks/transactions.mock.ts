import type { Transaction } from '../types'

const initialTransactions: Transaction[] = [
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

// Forzamos un identificador de sesión único en la ventana para separar usuarios si falla el storage
if (!(window as any).__ovniUserKey) {
  try {
    const userSession = localStorage.getItem('user') || localStorage.getItem('auth_user');
    if (userSession) {
      const user = JSON.parse(userSession);
      (window as any).__ovniUserKey = user.email || user.id || 'default';
    } else {
      (window as any).__ovniUserKey = `guest_${Math.random().toString(36).substring(2, 7)}`;
    }
  } catch {
    (window as any).__ovniUserKey = 'guest_fallback';
  }
}

const getStorageKey = (): string => {
  return `ovni_transactions_${(window as any).__ovniUserKey}`;
}

export const getMockTransactions = (): Transaction[] => {
  const storageKey = getStorageKey();
  const data = localStorage.getItem(storageKey);
  
  if (!data) {
    localStorage.setItem(storageKey, JSON.stringify(initialTransactions));
    return initialTransactions;
  }
  
  return JSON.parse(data);
};

export const getLatestTransactions = (): Transaction[] => {
  return getMockTransactions();
};

export const transactions: Transaction[] = getMockTransactions();