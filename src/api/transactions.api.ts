import { httpClient } from './httpClient'

export const transactionsApi = {
  async getTransactions(params?: {
    limit?: number
    cursor?: string
    type?: string
    status?: string
  }) {
    const response = await httpClient.get('/transactions', {
      params,
    })

    return response.data.data
  },

  async getTransaction(id: string) {
    const response = await httpClient.get(`/transactions/${id}`)

    return response.data.data
  },

  async deposit(data: {
    amount_in_cents: number
    currency: string
  }) {
    const response = await httpClient.post(
      '/transactions/deposit',
      data,
    )

    return response.data.data
  },
}