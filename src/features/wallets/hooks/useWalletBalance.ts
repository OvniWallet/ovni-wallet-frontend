import { useState, useEffect } from 'react';
import { walletsApi } from '@/api/wallets.api';
import type { BalanceItem } from '../types';

export function useWalletBalance() {
  const [balances, setBalances] = useState<BalanceItem[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState('ARS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletsApi.getWalletBalance();
      
      if (response.data && Array.isArray(response.data.balances)) {
        const balancesList = response.data.balances;
        setBalances(balancesList);
        
        if (balancesList.length > 0) {
          // Buscamos preferentemente el balance en pesos o, en su defecto, el primero de la lista
          const primaryBalance = balancesList.find(b => b.currency === 'ARS') || balancesList[0];
          
          setBalance(primaryBalance.amount);
          setCurrency(primaryBalance.currency);
        } else {
          // Si el usuario es nuevo y no tiene saldos, inicializamos en cero
          setBalance(0);
          setCurrency('ARS');
        }
      }
    } catch (err: any) {
      console.error('Error fetching balance:', err);
      setError(err.message || 'No se pudo cargar el balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return { 
    balances,    // <-- Lista completa para el Dashboard
    balance,     // <-- Balance principal
    currency,    // <-- Moneda del balance principal
    loading, 
    error, 
    refetch: fetchBalance 
  };
}