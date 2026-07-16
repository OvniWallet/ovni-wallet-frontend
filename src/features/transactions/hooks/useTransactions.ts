import { useCallback, useState } from 'react';
import { transactionsApi } from '@/api/transactions.api';
import { usePagination } from '@/hooks/usePagination';
import type { Transaction, TransactionStatus, TransactionType } from '../types';

interface UseTransactionsOptions {
  initialLimit?: number;
  initialType?: 'ALL' | TransactionType;
  initialStatus?: 'ALL' | TransactionStatus;
}

export function useTransactions({
  initialLimit = 10,
  initialType = 'ALL',
  initialStatus = 'ALL',
}: UseTransactionsOptions = {}) {
  const [limit] = useState(initialLimit);
  const [type, setTypeState] = useState<'ALL' | TransactionType>(initialType);
  const [status, setStatusState] = useState<'ALL' | TransactionStatus>(initialStatus);

  const fetchPage = useCallback(
    async (cursor: string | null) => {
      const response = await transactionsApi.getTransactions({
        limit,
        cursor,
        type: type !== 'ALL' ? type : undefined,
        status: status !== 'ALL' ? status : undefined,
      });

      return { items: response.data.transactions, nextCursor: response.data.next_cursor };
    },
    [limit, type, status],
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

  const setStatus = (newStatus: 'ALL' | TransactionStatus) => {
    setStatusState(newStatus);
  };

  return {
    transactions,
    loading,
    error,
    hasNext,
    hasPrev,
    type,
    setType,
    status,
    setStatus,
    nextPage: next,
    prevPage: prev,
    refetch: reload,
  };
}
