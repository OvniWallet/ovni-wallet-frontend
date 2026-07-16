export type VirtualCardStatus = 'ACTIVE' | 'BLOCKED'

export interface VirtualCardData {
  card_id: string
  masked_number: string
  status: VirtualCardStatus
  currency_default: string
}

export interface CreateVirtualCardRequest {
  currency_default: string
}

export interface SimulateCardSpendRequest {
  card_id: string
  amount_in_cents: number
  currency: string
  merchant_name: string
  idempotency_key?: string
}

export interface SimulateCardSpendResponse {
  transaction_id: string
  status: 'COMPLETED' | 'FAILED'
}
