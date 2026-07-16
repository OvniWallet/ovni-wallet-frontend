import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTransactions } from './useTransactions'
import { transactionsApi } from '@/api/transactions.api'

vi.mock('@/api/transactions.api', () => ({
  transactionsApi: { getTransactions: vi.fn() },
}))

describe('useTransactions', () => {
  beforeEach(() => {
    vi.mocked(transactionsApi.getTransactions).mockReset()
  })

  it('pide la primera página con cursor null y expone next_cursor', async () => {
    vi.mocked(transactionsApi.getTransactions).mockResolvedValue({
      status: 'success',
      data: {
        transactions: [
          { transaction_id: 't1', type: 'DEPOSIT', status: 'COMPLETED', metadata: null, created_at: '2026-01-01' },
        ],
        next_cursor: 'cursor-1',
      },
    })

    const { result } = renderHook(() => useTransactions({ initialLimit: 10 }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(transactionsApi.getTransactions).toHaveBeenCalledWith({ limit: 10, cursor: null, type: undefined })
    expect(result.current.transactions).toHaveLength(1)
    expect(result.current.hasNext).toBe(true)
  })

  it('re-consulta desde el principio cuando cambia el filtro de tipo', async () => {
    vi.mocked(transactionsApi.getTransactions).mockResolvedValue({
      status: 'success',
      data: { transactions: [], next_cursor: null },
    })

    const { result } = renderHook(() => useTransactions({ initialLimit: 10 }))
    await waitFor(() => expect(result.current.loading).toBe(false))

    result.current.setType('DEPOSIT')

    await waitFor(() =>
      expect(transactionsApi.getTransactions).toHaveBeenLastCalledWith({
        limit: 10,
        cursor: null,
        type: 'DEPOSIT',
      }),
    )
  })
})
