export interface BalanceItem {
  currency: string;
  amount: number; // El saldo real mapeado de centavos a decimales (ej. 125000.5)
}

// Alias para mantener compatibilidad con BalanceCardProps sin cambiar el componente
export type Balance = BalanceItem;

export interface BalanceResponse {
  status: string;
  data: {
    balances: BalanceItem[];
  };
}