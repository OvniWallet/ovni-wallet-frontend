import { httpClient } from './httpClient'
import { generateIdempotencyKey } from '@/lib/idempotency'

export type ExchangeCurrency = 'USD' | 'EUR' | 'GBP' | 'ARS' | 'BRL' | 'JPY'

export interface ExchangeQuoteRequest {
  source_currency: ExchangeCurrency
  target_currency: ExchangeCurrency
  source_amount_cents: number
}

export interface ExchangeQuoteResponse {
  rate_value: string
  target_amount_cents: number
  rate_is_stale: boolean
}

export interface ExchangeCreateRequest extends ExchangeQuoteRequest {
  idempotency_key?: string
}

export interface ExchangeCreateResponse {
  transaction_id: string
  rate_applied: string
  target_amount_cents: number
}

export const exchangeApi = {
  getExchangeRates: async () => {
    const response = await httpClient.get('/exchange/rates')
    return response.data
  },

  getQuote: async (params: ExchangeQuoteRequest): Promise<ExchangeQuoteResponse> => {
    const response = await httpClient.get('/exchange/quote', { params })
    return response.data.data
  },

  createExchange: async (
    payload: ExchangeCreateRequest,
  ): Promise<ExchangeCreateResponse> => {
    const body = {
      ...payload,
      idempotency_key: payload.idempotency_key ?? generateIdempotencyKey(),
    }

    const response = await httpClient.post('/exchange', body)
    return response.data.data
  },
}