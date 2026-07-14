import { httpClient } from './httpClient'

export const exchangeApi = {
  async getQuote(params: {
    source_currency: string
    target_currency: string
    source_amount_cents: number
  }) {
    const response = await httpClient.get('/exchange/quote', {
      params,
    })

    return response.data.data
  },

  async exchange(data: {
    source_currency: string
    target_currency: string
    source_amount_cents: number
    idempotency_key: string
  }) {
    const response = await httpClient.post('/exchange', data)

    return response.data.data
  },
}