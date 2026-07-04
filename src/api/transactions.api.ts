import { httpClient } from './httpClient';

export const transactionsApi = {
  getTransactions: async () => {
    const response = await httpClient.get('/transactions');
    return response.data;
  },
};
