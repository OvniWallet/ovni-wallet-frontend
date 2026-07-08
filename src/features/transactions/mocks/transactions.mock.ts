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

const getStorageKey = (): string => {
  try {
    const userSession = localStorage.getItem('user'); 
    if (userSession) {
      const user = JSON.parse(userSession);
      return `ovni_transactions_${user.email || user.id || 'default'}`;
    }
  } catch (e) {
    console.error(e);
  }
  return 'ovni_transactions_guest';
}

export const getMockTransactions = (): Transaction[] => {
  const storageKey = getStorageKey();
  const data = localStorage.getItem(storageKey);
  
  if (!data) {
    localStorage.setItem(storageKey, JSON.stringify(initialTransactions));
    return initialTransactions;
  }
  
  return JSON.parse(data);
}


export const getLatestTransactions = (): Transaction[] => {
  return getMockTransactions();
};

// Dejamos la exportación vieja por compatibilidad si se usa en otros lados,
// pero internamente llamará a la función dinámica.
export const transactions: Transaction[] = getMockTransactions();