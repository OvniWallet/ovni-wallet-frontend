import { httpClient } from './httpClient';
import type { BalanceResponse } from '@/features/wallets/types';

export const walletsApi = {
  getWalletBalance: async (): Promise<BalanceResponse> => {
    // Al usar la ruta relativa '/wallets/balance', Axios le concatena la baseURL de httpClient
    const response = await httpClient.get<BalanceResponse>('/wallets/balance');
    return response.data; // Retorna exactamente { status: 'success', data: { balance, currency } }
  },
};