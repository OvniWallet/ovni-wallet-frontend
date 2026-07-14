import { httpClient } from './httpClient'

export interface TransferRequest {
  recipient_email: string
  amount_in_cents: number
  currency: string
  idempotency_key: string
}

export const p2pApi = {
  async transfer(data: TransferRequest) {
    const response = await httpClient.post('/p2p/transfers', data)

    return response.data.data
  },
}