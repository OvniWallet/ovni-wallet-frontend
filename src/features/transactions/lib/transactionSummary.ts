import type { Transaction, TransactionType } from '../types'

const TYPE_FALLBACK_DESCRIPTION: Record<TransactionType, string> = {
  DEPOSIT: 'Depósito',
  P2P_TRANSFER: 'Transferencia P2P',
  EXCHANGE: 'Conversión de divisas',
  CARD_SPEND: 'Consumo con tarjeta',
}

export interface TransactionSummary {
  amount: number | null
  currency: string | null
  description: string
}

/**
 * El endpoint de listado de transacciones solo guarda amount_in_cents/currency
 * en `metadata` para DEPOSIT y P2P_TRANSFER. Para EXCHANGE y CARD_SPEND ese dato
 * vive únicamente en ledger_entries, que el listado no expone — se muestra null
 * en vez de inventar un valor.
 */
export function getTransactionSummary(transaction: Transaction): TransactionSummary {
  const metadata = transaction.metadata as Record<string, unknown> | null

  if (transaction.type === 'DEPOSIT' || transaction.type === 'P2P_TRANSFER') {
    const amountInCents = typeof metadata?.amount_in_cents === 'number' ? metadata.amount_in_cents : null
    const currency = typeof metadata?.currency === 'string' ? metadata.currency : null
    const description =
      typeof metadata?.description === 'string'
        ? metadata.description
        : TYPE_FALLBACK_DESCRIPTION[transaction.type]

    return {
      amount: amountInCents !== null ? amountInCents / 100 : null,
      currency,
      description,
    }
  }

  if (transaction.type === 'CARD_SPEND') {
    const merchant = typeof metadata?.merchant_name === 'string' ? metadata.merchant_name : null

    return {
      amount: null,
      currency: null,
      description: merchant ? `Consumo en ${merchant}` : TYPE_FALLBACK_DESCRIPTION.CARD_SPEND,
    }
  }

  return {
    amount: null,
    currency: null,
    description: TYPE_FALLBACK_DESCRIPTION[transaction.type],
  }
}
