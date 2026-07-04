import { httpClient } from './httpClient';

export const virtualCardsApi = {
  getCards: async () => {
    const response = await httpClient.get('/virtual-cards');
    return response.data;
  },
};
