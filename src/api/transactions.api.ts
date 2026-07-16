import { httpClient } from './httpClient';
import { generateIdempotencyKey } from '@/lib/idempotency';
import type { Transaction, TransactionDetail } from '@/features/transactions/types';

export interface TransactionsPageResponse {
  status: string;
  data: {
    transactions: Transaction[];
    next_cursor: string | null;
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
    limit: number;
    cursor?: string | null;
    type?: string;
    status?: string;
  }): Promise<TransactionsPageResponse> => {
    const response = await httpClient.get<TransactionsPageResponse>('/transactions', {
      params: {
        limit: params.limit,
        cursor: params.cursor ?? undefined,
        type: params.type,
        status: params.status,
      },
    });
    return response.data;
  },

  getTransactionById: async (id: string): Promise<TransactionDetail> => {
    const response = await httpClient.get(`/transactions/${id}`);
    return response.data.data;
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
