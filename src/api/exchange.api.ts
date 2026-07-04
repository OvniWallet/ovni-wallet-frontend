import { httpClient } from './httpClient';

export const exchangeApi = {
  getExchangeRates: async () => {
    const response = await httpClient.get('/exchange/rates');
    return response.data;
  },
};
