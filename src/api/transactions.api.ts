import { httpClient } from './httpClient';
import { generateIdempotencyKey } from '@/lib/idempotency';
import type { Transaction } from '@/features/transactions/types';

export interface PaginatedTransactionsResponse {
  status: string;
  data: {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DepositPayload {
  amount_in_cents: number;
  currency: string;
  idempotency_key?: string;
}

export interface DepositResult {
  transaction_id: string;
  type: string;
  status: string;
}

export const transactionsApi = {
  getTransactions: async (params: {
    page: number;
    limit: number;
    type?: string;
    search?: string;
  }): Promise<PaginatedTransactionsResponse> => {
    // Axios adjunta automáticamente los params a la URL como ?page=X&limit=Y
    const response = await httpClient.get<PaginatedTransactionsResponse>('/transactions', {
      params,
    });
    return response.data;
  },

  deposit: async (payload: DepositPayload): Promise<DepositResult> => {
    const body = {
      amount_in_cents: payload.amount_in_cents,
      currency: payload.currency,
      idempotency_key: payload.idempotency_key ?? generateIdempotencyKey(),
    };

    const response = await httpClient.post('/transactions/deposit', body);
    return response.data.data;
  },
};