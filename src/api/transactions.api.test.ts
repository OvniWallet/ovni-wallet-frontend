import { beforeEach, describe, expect, it, vi } from 'vitest'
import { httpClient } from './httpClient'
import { transactionsApi } from './transactions.api'

vi.mock('./httpClient', () => ({
  httpClient: { post: vi.fn(), get: vi.fn() },
}))

describe('transactionsApi.deposit', () => {
  beforeEach(() => {
    vi.mocked(httpClient.post).mockReset()
  })

  it('envía amount_in_cents, currency e idempotency_key a POST /transactions/deposit', async () => {
    vi.mocked(httpClient.post).mockResolvedValue({
      data: { status: 'success', data: { transaction_id: 'tx-1', type: 'DEPOSIT', status: 'COMPLETED' } },
    })

    const result = await transactionsApi.deposit({
      amount_in_cents: 5000,
      currency: 'USD',
      idempotency_key: 'fixed-key',
    })

    expect(httpClient.post).toHaveBeenCalledWith('/transactions/deposit', {
      amount_in_cents: 5000,
      currency: 'USD',
      idempotency_key: 'fixed-key',
    })
    expect(result).toEqual({ transaction_id: 'tx-1', type: 'DEPOSIT', status: 'COMPLETED' })
  })

  it('genera una idempotency_key automáticamente si no se provee una', async () => {
    vi.mocked(httpClient.post).mockResolvedValue({
      data: { status: 'success', data: { transaction_id: 'tx-2', type: 'DEPOSIT', status: 'COMPLETED' } },
    })

    await transactionsApi.deposit({ amount_in_cents: 1000, currency: 'ARS' })

    const sentBody = vi.mocked(httpClient.post).mock.calls[0][1] as any
    expect(typeof sentBody.idempotency_key).toBe('string')
    expect(sentBody.idempotency_key.length).toBeGreaterThan(0)
  })
})
