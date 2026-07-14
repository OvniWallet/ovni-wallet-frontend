import { httpClient } from './httpClient'

export const virtualCardsApi = {
  async getCards() {
    const response = await httpClient.get('/virtual-cards')

    return response.data.data
  },

  async createCard(currency: string) {
    const response = await httpClient.post('/virtual-cards', {
      currency,
    })

    return response.data.data
  },

  async blockCard(cardId: string) {
    const response = await httpClient.patch(
      `/virtual-cards/${cardId}/block`,
    )

    return response.data.data
  },

  async simulateSpend(data: {
    card_id: string
    amount_in_cents: number
    currency: string
    merchant: string
  }) {
    const response = await httpClient.post(
      '/virtual-cards/simulate-spend',
      data,
    )

    return response.data.data
  },
}