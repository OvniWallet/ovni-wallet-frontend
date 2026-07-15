import { beforeEach, describe, expect, it, vi } from 'vitest'
import { httpClient } from './httpClient'
import { virtualCardsApi } from './virtualCards.api'

vi.mock('./httpClient', () => ({
  httpClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}))

describe('virtualCardsApi', () => {
  beforeEach(() => {
    vi.mocked(httpClient.get).mockReset()
    vi.mocked(httpClient.post).mockReset()
    vi.mocked(httpClient.patch).mockReset()
  })

  it('getCards devuelve la lista de tarjetas', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({
      data: { status: 'success', data: { cards: [{ card_id: 'c1', masked_number: '•••• 1234', status: 'ACTIVE', currency_default: 'USD' }] } },
    })

    const cards = await virtualCardsApi.getCards()

    expect(httpClient.get).toHaveBeenCalledWith('/virtual-cards')
    expect(cards).toEqual([{ card_id: 'c1', masked_number: '•••• 1234', status: 'ACTIVE', currency_default: 'USD' }])
  })

  it('createCard envía currency_default a POST /virtual-cards', async () => {
    vi.mocked(httpClient.post).mockResolvedValue({
      data: { status: 'success', data: { card_id: 'c2', masked_number: '•••• 5678', status: 'ACTIVE' } },
    })

    await virtualCardsApi.createCard({ currency_default: 'EUR' })

    expect(httpClient.post).toHaveBeenCalledWith('/virtual-cards', { currency_default: 'EUR' })
  })

  it('blockCard llama a PATCH /virtual-cards/:id/block', async () => {
    vi.mocked(httpClient.patch).mockResolvedValue({
      data: { status: 'success', data: { card_id: 'c1', status: 'BLOCKED' } },
    })

    await virtualCardsApi.blockCard('c1')

    expect(httpClient.patch).toHaveBeenCalledWith('/virtual-cards/c1/block')
  })

  it('simulateSpend genera idempotency_key si no se provee', async () => {
    vi.mocked(httpClient.post).mockResolvedValue({
      data: { status: 'success', data: { transaction_id: 'tx-1', status: 'COMPLETED' } },
    })

    await virtualCardsApi.simulateSpend({
      card_id: 'c1',
      amount_in_cents: 1500,
      currency: 'USD',
      merchant_name: 'Netflix',
    })

    const [, body] = vi.mocked(httpClient.post).mock.calls[0]
    expect((body as any).card_id).toBe('c1')
    expect(typeof (body as any).idempotency_key).toBe('string')
  })
})
