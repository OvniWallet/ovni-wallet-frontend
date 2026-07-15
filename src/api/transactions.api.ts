import { httpClient } from './httpClient';
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
};