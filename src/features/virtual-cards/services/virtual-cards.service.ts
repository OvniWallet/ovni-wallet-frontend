import { virtualCardMock } from '../mocks/virtual-cards.mock'
import type {
  CreateVirtualCardRequest,
  CreateVirtualCardResponse,
  SimulateCardSpendRequest,
  SimulateCardSpendResponse,
  UpdateVirtualCardStatusRequest,
  VirtualCardData,
} from '../types'

let currentCard: VirtualCardData = { ...virtualCardMock }

export const virtualCardsService = {
  async getCard(): Promise<VirtualCardData> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { ...currentCard }
  },

  async createCard(
    request: CreateVirtualCardRequest,
  ): Promise<CreateVirtualCardResponse> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    currentCard = {
      ...virtualCardMock,
      id: `card-${Date.now()}`,
      currency: request.currency,
    }

    return { card: { ...currentCard } }
  },

  async updateStatus(
    request: UpdateVirtualCardStatusRequest,
  ): Promise<VirtualCardData> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    currentCard = {
      ...currentCard,
      status: request.status,
    }

    return { ...currentCard }
  },

  async simulateSpend(
    request: SimulateCardSpendRequest,
  ): Promise<SimulateCardSpendResponse> {
    await new Promise((resolve) => setTimeout(resolve, 700))

    return {
      transactionId: `card-spend-${Date.now()}`,
      status:
        currentCard.status === 'ACTIVE' && request.amount > 0
          ? 'COMPLETED'
          : 'REJECTED',
    }
  },
}