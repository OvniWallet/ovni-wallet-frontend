import { httpClient } from './httpClient';

export const p2pApi = {
  getOffers: async () => {
    const response = await httpClient.get('/p2p/offers');
    return response.data;
  },
};
