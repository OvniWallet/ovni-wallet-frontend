import { describe, expect, it } from 'vitest'
import { getTransactionSummary } from './transactionSummary'
import type { Transaction } from '../types'

function makeTx(overrides: Partial<Transaction>): Transaction {
  return {
    transaction_id: 'tx-1',
    type: 'DEPOSIT',
    status: 'COMPLETED',
    metadata: null,
    created_at: '2026-07-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('getTransactionSummary', () => {
  it('lee amount_in_cents/currency/description desde metadata para DEPOSIT', () => {
    const summary = getTransactionSummary(
      makeTx({
        type: 'DEPOSIT',
        metadata: { description: 'Depósito simulado inicial', currency: 'USD', amount_in_cents: 5000 },
      }),
    )

    expect(summary).toEqual({ amount: 50, currency: 'USD', description: 'Depósito simulado inicial' })
  })

  it('lee amount_in_cents/currency desde metadata para P2P_TRANSFER', () => {
    const summary = getTransactionSummary(
      makeTx({
        type: 'P2P_TRANSFER',
        metadata: { description: 'Transferencia P2P', currency: 'ARS', amount_in_cents: 1000 },
      }),
    )

    expect(summary).toEqual({ amount: 10, currency: 'ARS', description: 'Transferencia P2P' })
  })

  it('retorna amount/currency null para EXCHANGE (el backend no lo expone en el listado)', () => {
    const summary = getTransactionSummary(makeTx({ type: 'EXCHANGE', metadata: { user_id: 'u-1' } }))

    expect(summary).toEqual({ amount: null, currency: null, description: 'Conversión de divisas' })
  })

  it('retorna amount/currency null para CARD_SPEND pero usa el merchant como descripción', () => {
    const summary = getTransactionSummary(
      makeTx({ type: 'CARD_SPEND', metadata: { merchant_name: 'Netflix', card_id: 'card-1' } }),
    )

    expect(summary).toEqual({ amount: null, currency: null, description: 'Consumo en Netflix' })
  })

  it('no explota si metadata es null', () => {
    const summary = getTransactionSummary(makeTx({ type: 'DEPOSIT', metadata: null }))

    expect(summary).toEqual({ amount: null, currency: null, description: 'Depósito' })
  })
})
