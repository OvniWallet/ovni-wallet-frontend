import { exchangeApi } from '@/api/exchange.api'
import type {
  ExchangeQuote,
  ExchangeRequest,
  ExchangeResponse,
} from '../types'

export const exchangeService = {
  async getQuote(
    request: ExchangeRequest,
  ): Promise<ExchangeQuote> {
    return exchangeApi.getQuote({
      source_currency: request.fromCurrency,
      target_currency: request.toCurrency,
      source_amount_cents: Math.round(request.amount * 100),
    })
  },

  async exchange(
    request: ExchangeRequest,
  ): Promise<ExchangeResponse> {
    return exchangeApi.exchange({
      source_currency: request.fromCurrency,
      target_currency: request.toCurrency,
      source_amount_cents: Math.round(request.amount * 100),
      idempotency_key: crypto.randomUUID(),
    })
  },
}