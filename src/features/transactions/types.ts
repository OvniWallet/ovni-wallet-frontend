export type TransactionType =
  | 'DEPOSIT'
  | 'P2P_TRANSFER'
  | 'EXCHANGE'
  | 'CARD_SPEND'

export type TransactionStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED'

export interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: string
  description: string
  createdAt: string
}