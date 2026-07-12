import { getMockQuote } from '../mocks/exchange.mock'
import type {
  ExchangeQuote,
  ExchangeRequest,
  ExchangeResponse,
} from '../types'

export const exchangeService = {
  async getQuote(
    request: ExchangeRequest,
  ): Promise<ExchangeQuote> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return getMockQuote(
      request.fromCurrency,
      request.toCurrency,
    )
  },

  async exchange(
    request: ExchangeRequest,
  ): Promise<ExchangeResponse> {
    await new Promise((resolve) => setTimeout(resolve, 700))

    const quote = getMockQuote(
      request.fromCurrency,
      request.toCurrency,
    )

    return {
      convertedAmount: request.amount * quote.rate,
      rate: quote.rate,
      transactionId: `exchange-${Date.now()}`,
    }
  },
}