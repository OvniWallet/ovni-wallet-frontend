import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePagination } from './usePagination'

describe('usePagination', () => {
  let fetchPage: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchPage = vi.fn()
  })

  it('carga la primera página al montar', async () => {
    fetchPage.mockResolvedValue({ items: ['a', 'b'], nextCursor: 'cursor-1' })

    const { result } = renderHook(() => usePagination(fetchPage as any))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchPage).toHaveBeenCalledWith(null)
    expect(result.current.items).toEqual(['a', 'b'])
    expect(result.current.hasNext).toBe(true)
    expect(result.current.hasPrev).toBe(false)
  })

  it('avanza a la siguiente página con el cursor recibido y permite retroceder', async () => {
    fetchPage
      .mockResolvedValueOnce({ items: ['a'], nextCursor: 'cursor-1' })
      .mockResolvedValueOnce({ items: ['b'], nextCursor: null })

    const { result } = renderHook(() => usePagination(fetchPage as any))
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.next()
    })

    expect(fetchPage).toHaveBeenNthCalledWith(2, 'cursor-1')
    expect(result.current.items).toEqual(['b'])
    expect(result.current.hasNext).toBe(false)
    expect(result.current.hasPrev).toBe(true)

    fetchPage.mockResolvedValueOnce({ items: ['a'], nextCursor: 'cursor-1' })

    await act(async () => {
      await result.current.prev()
    })

    expect(fetchPage).toHaveBeenNthCalledWith(3, null)
    expect(result.current.items).toEqual(['a'])
    expect(result.current.hasPrev).toBe(false)
  })

  it('expone el error si fetchPage rechaza', async () => {
    fetchPage.mockRejectedValue(new Error('boom'))

    const { result } = renderHook(() => usePagination(fetchPage as any))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('boom')
  })
})
