import { httpClient } from './httpClient';

export const walletsApi = {
  getWallets: async () => {
    const response = await httpClient.get('/wallets');
    return response.data;
  },
};
