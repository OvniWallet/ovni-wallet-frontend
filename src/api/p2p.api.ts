import { httpClient } from './httpClient'
import { generateIdempotencyKey } from '@/lib/idempotency'

export type P2PCurrency = 'USD' | 'EUR' | 'GBP' | 'ARS' | 'BRL' | 'JPY'

export interface P2PTransferRequest {
  recipient_email: string
  amount_in_cents: number
  currency: P2PCurrency
  idempotency_key?: string
}

export interface P2PTransferResponse {
  transaction_id: string
  amount_transferred: number
  currency: string
}

export const p2pApi = {
  getOffers: async () => {
    const response = await httpClient.get('/p2p/offers')
    return response.data
  },

  transfer: async (payload: P2PTransferRequest): Promise<P2PTransferResponse> => {
    const body = {
      ...payload,
      idempotency_key: payload.idempotency_key ?? generateIdempotencyKey(),
    }

    const response = await httpClient.post('/p2p/transfers', body)
    return response.data.data
  },
}