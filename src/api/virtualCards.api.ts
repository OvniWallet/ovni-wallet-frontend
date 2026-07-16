import { httpClient } from './httpClient';
import { generateIdempotencyKey } from '@/lib/idempotency';
import type {
  CreateVirtualCardRequest,
  SimulateCardSpendRequest,
  SimulateCardSpendResponse,
  VirtualCardData,
} from '@/features/virtual-cards/types';

export const virtualCardsApi = {
  getCards: async (): Promise<VirtualCardData[]> => {
    const response = await httpClient.get('/virtual-cards');
    return response.data.data.cards;
  },

  createCard: async (payload: CreateVirtualCardRequest): Promise<VirtualCardData> => {
    const response = await httpClient.post('/virtual-cards', payload);
    return response.data.data;
  },

  blockCard: async (cardId: string): Promise<VirtualCardData> => {
    const response = await httpClient.patch(`/virtual-cards/${cardId}/block`);
    return response.data.data;
  },

  simulateSpend: async (payload: SimulateCardSpendRequest): Promise<SimulateCardSpendResponse> => {
    const body = {
      ...payload,
      idempotency_key: payload.idempotency_key ?? generateIdempotencyKey(),
    };

    const response = await httpClient.post('/virtual-cards/simulate-spend', body);
    return response.data.data;
  },
};
