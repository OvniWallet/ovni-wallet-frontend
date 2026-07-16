export type Currency = 'ARS' | 'USD' | 'EUR'

export interface ExchangeQuote {
  fromCurrency: Currency
  toCurrency: Currency
  rate: number
  updatedAt: string
}

export interface ExchangeRequest {
  fromCurrency: Currency
  toCurrency: Currency
  amount: number
}

export interface ExchangeResponse {
  convertedAmount: number
  rate: number
  transactionId?: string
}