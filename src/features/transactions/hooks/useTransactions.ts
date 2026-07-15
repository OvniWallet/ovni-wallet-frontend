import { useState, useEffect, useCallback } from 'react';
import { transactionsApi } from '@/api/transactions.api';
import type { Transaction, TransactionType } from '../types';

interface UseTransactionsOptions {
  initialLimit?: number;
  initialType?: 'ALL' | TransactionType;
}

export function useTransactions({ initialLimit = 10, initialType = 'ALL' }: UseTransactionsOptions = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de paginación y filtros
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(initialLimit);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [type, setType] = useState<'ALL' | TransactionType>(initialType);
  const [search, setSearch] = useState<string>('');

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Enviamos el filtro de tipo solo si no es 'ALL'
      const filterType = type !== 'ALL' ? type : undefined;
      const searchQuery = search.trim() ? search : undefined;

      const response = await transactionsApi.getTransactions({
        page,
        limit,
        type: filterType,
        search: searchQuery,
      });

      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.total);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'No se pudieron cargar las transacciones');
    } finally {
      setLoading(false);
    }
  }, [page, limit, type, search]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Si cambia el filtro o la búsqueda, reiniciamos a la página 1
  const handleFilterChange = (newType: 'ALL' | TransactionType) => {
    setType(newType);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return {
    transactions,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    type,
    search,
    setType: handleFilterChange,
    setSearch: handleSearchChange,
    nextPage,
    prevPage,
    refetch: fetchTransactions,
  };
}