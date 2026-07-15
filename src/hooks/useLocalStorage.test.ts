import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('inicializa con el valor por defecto si no hay nada guardado', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('lee el valor ya guardado en localStorage al montar', () => {
    localStorage.setItem('test_key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('test_key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  it('persiste el valor en localStorage al actualizar', () => {
    const { result } = renderHook(() => useLocalStorage<string | null>('test_key', null))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('test_key')).toBe(JSON.stringify('updated'))
  })

  it('elimina la clave de localStorage cuando el valor se setea a null', () => {
    const { result } = renderHook(() => useLocalStorage<string | null>('test_key', null))

    act(() => {
      result.current[1]('updated')
    })
    act(() => {
      result.current[1](null)
    })

    expect(localStorage.getItem('test_key')).toBeNull()
  })
})
