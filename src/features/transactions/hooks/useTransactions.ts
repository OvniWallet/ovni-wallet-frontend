import { useCallback, useState } from 'react';
import { transactionsApi } from '@/api/transactions.api';
import { usePagination } from '@/hooks/usePagination';
import type { Transaction, TransactionType } from '../types';

interface UseTransactionsOptions {
  initialLimit?: number;
  initialType?: 'ALL' | TransactionType;
}

export function useTransactions({ initialLimit = 10, initialType = 'ALL' }: UseTransactionsOptions = {}) {
  const [limit] = useState(initialLimit);
  const [type, setTypeState] = useState<'ALL' | TransactionType>(initialType);

  const fetchPage = useCallback(
    async (cursor: string | null) => {
      const response = await transactionsApi.getTransactions({
        limit,
        cursor,
        type: type !== 'ALL' ? type : undefined,
      });

      return { items: response.data.transactions, nextCursor: response.data.next_cursor };
    },
    [limit, type],
  );

  const {
    items: transactions,
    loading,
    error,
    hasNext,
    hasPrev,
    next,
    prev,
    reload,
  } = usePagination<Transaction>(fetchPage);

  const setType = (newType: 'ALL' | TransactionType) => {
    setTypeState(newType);
  };

  return {
    transactions,
    loading,
    error,
    hasNext,
    hasPrev,
    type,
    setType,
    nextPage: next,
    prevPage: prev,
    refetch: reload,
  };
}
