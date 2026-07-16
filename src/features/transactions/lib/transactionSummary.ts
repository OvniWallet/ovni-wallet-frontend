import type { Transaction, TransactionType } from '../types'

export interface TransactionCounterparty {
  originLabel: string
  destinationLabel: string
}

export interface TransactionAdditionalInfoItem {
  label: string
  value: string
}

export interface TransactionGeolocation {
  latitude: number
  longitude: number
}

export interface TransactionDetailInfo {
  counterparty: TransactionCounterparty | null
  additionalInfo: TransactionAdditionalInfoItem[]
  geolocation: TransactionGeolocation | null
}

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

/**
 * Extrae, sin inventar datos, lo que cada tipo de transacción realmente
 * guarda en `metadata` para el comprobante de detalle. El backend resuelve
 * sender_name/recipient_name para P2P (ver transactions.service.ts); si por
 * algún motivo no vinieran (transacciones previas al cambio), se distingue
 * "Vos" del otro lado comparando contra el usuario autenticado.
 */
export function getTransactionDetailInfo(
  transaction: Transaction,
  currentUserId: string | null,
): TransactionDetailInfo {
  const metadata = transaction.metadata as Record<string, unknown> | null

  return {
    counterparty: getCounterparty(transaction, metadata, currentUserId),
    additionalInfo: getAdditionalInfo(transaction, metadata),
    geolocation: getGeolocation(metadata),
  }
}

function getGeolocation(metadata: Record<string, unknown> | null): TransactionGeolocation | null {
  const latitude = typeof metadata?.latitude === 'number' ? metadata.latitude : null
  const longitude = typeof metadata?.longitude === 'number' ? metadata.longitude : null

  if (latitude === null || longitude === null) return null

  return { latitude, longitude }
}

function getCounterparty(
  transaction: Transaction,
  metadata: Record<string, unknown> | null,
  currentUserId: string | null,
): TransactionCounterparty | null {
  if (transaction.type !== 'P2P_TRANSFER') return null

  const senderId = typeof metadata?.senderId === 'string' ? metadata.senderId : null
  const recipientId = typeof metadata?.recipientId === 'string' ? metadata.recipientId : null

  if (!senderId || !recipientId) return null

  const senderName = typeof metadata?.sender_name === 'string' ? metadata.sender_name : null
  const recipientName = typeof metadata?.recipient_name === 'string' ? metadata.recipient_name : null

  const label = (userId: string, name: string | null) => {
    const isCurrentUser = Boolean(currentUserId) && userId === currentUserId
    if (name) return isCurrentUser ? `${name} (Vos)` : name
    return isCurrentUser ? 'Vos' : 'Otro usuario'
  }

  return {
    originLabel: label(senderId, senderName),
    destinationLabel: label(recipientId, recipientName),
  }
}

function getAdditionalInfo(
  transaction: Transaction,
  metadata: Record<string, unknown> | null,
): TransactionAdditionalInfoItem[] {
  if (transaction.type === 'CARD_SPEND') {
    const items: TransactionAdditionalInfoItem[] = []
    const merchant = typeof metadata?.merchant_name === 'string' ? metadata.merchant_name : null

    if (merchant) items.push({ label: 'Comercio', value: merchant })
    if (typeof metadata?.triggered_by_exchange_transaction_id === 'string') {
      items.push({ label: 'Conversión de moneda', value: 'Se convirtió saldo automáticamente para cubrir la compra.' })
    }

    return items
  }

  if (transaction.type === 'EXCHANGE') {
    const requestPayload = metadata?.request_payload as Record<string, unknown> | undefined
    const items: TransactionAdditionalInfoItem[] = []

    if (typeof requestPayload?.source_currency === 'string') {
      items.push({ label: 'Divisa de origen', value: requestPayload.source_currency })
    }
    if (typeof requestPayload?.target_currency === 'string') {
      items.push({ label: 'Divisa de destino', value: requestPayload.target_currency })
    }

    return items
  }

  return []
}
