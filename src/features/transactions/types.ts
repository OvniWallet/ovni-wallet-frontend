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
  transaction_id: string
  type: TransactionType
  status: TransactionStatus
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface LedgerEntryDetail {
  id: string
  type: 'DEBIT' | 'CREDIT'
  amount_in_cents: number
  currency: string
}

export interface TransactionDetail extends Transaction {
  ledger_entries: LedgerEntryDetail[]
}
