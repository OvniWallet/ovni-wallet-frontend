import { virtualCardsApi } from '@/api/virtualCards.api'
import type {
  CreateVirtualCardRequest,
  CreateVirtualCardResponse,
  SimulateCardSpendRequest,
  SimulateCardSpendResponse,
  UpdateVirtualCardStatusRequest,
  VirtualCardData,
} from '../types'

export const virtualCardsService = {
  async getCard(): Promise<VirtualCardData> {
    const cards = await virtualCardsApi.getCards()

    return cards[0]
  },

  async createCard(
    request: CreateVirtualCardRequest,
  ): Promise<CreateVirtualCardResponse> {
    return virtualCardsApi.createCard(request.currency)
  },

  async updateStatus(
    request: UpdateVirtualCardStatusRequest,
  ): Promise<VirtualCardData> {
    if (request.status !== 'BLOCKED') {
      throw new Error('El backend todavía no permite desbloquear tarjetas.')
    }

    return virtualCardsApi.blockCard(request.cardId)
  },

  async simulateSpend(
    request: SimulateCardSpendRequest,
  ): Promise<SimulateCardSpendResponse> {
    return virtualCardsApi.simulateSpend({
      card_id: request.cardId,
      amount_in_cents: Math.round(request.amount * 100),
      currency: request.currency,
      merchant: request.merchant,
    })
  },
}