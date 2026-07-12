export type VirtualCardStatus = 'ACTIVE' | 'BLOCKED'

export interface VirtualCardData {
  id: string
  cardholderName: string
  maskedNumber: string
  expirationDate: string
  status: VirtualCardStatus
  currency: string
}

export interface CreateVirtualCardRequest {
  currency: string
}

export interface CreateVirtualCardResponse {
  card: VirtualCardData
}

export interface UpdateVirtualCardStatusRequest {
  cardId: string
  status: VirtualCardStatus
}

export interface SimulateCardSpendRequest {
  cardId: string
  amount: number
  currency: string
  merchant: string
}

export interface SimulateCardSpendResponse {
  transactionId: string
  status: 'COMPLETED' | 'REJECTED'
}