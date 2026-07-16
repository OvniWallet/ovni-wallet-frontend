import type { Currency, ExchangeQuote } from '../types'

const rates: Record<Currency, Record<Currency, number>> = {
  ARS: {
    ARS: 1,
    USD: 0.0008,
    EUR: 0.00072,
  },
  USD: {
    ARS: 1250,
    USD: 1,
    EUR: 0.9,
  },
  EUR: {
    ARS: 1388.89,
    USD: 1.11,
    EUR: 1,
  },
}

export function getMockQuote(
  fromCurrency: Currency,
  toCurrency: Currency,
): ExchangeQuote {
  return {
    fromCurrency,
    toCurrency,
    rate: rates[fromCurrency][toCurrency],
    updatedAt: new Date().toISOString(),
  }
}