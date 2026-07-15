import { useCallback, useEffect, useRef, useState } from 'react'

export interface PaginatedPage<T> {
  items: T[]
  nextCursor: string | null
}

export function usePagination<T>(fetchPage: (cursor: string | null) => Promise<PaginatedPage<T>>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  // Pila de cursores ya visitados para poder "retroceder" — el backend solo
  // entrega next_cursor, no soporta paginación hacia atrás nativamente.
  const cursorHistory = useRef<Array<string | null>>([])
  const currentCursor = useRef<string | null>(null)

  const load = useCallback(
    async (cursor: string | null) => {
      setLoading(true)
      setError(null)

      try {
        const page = await fetchPage(cursor)
        setItems(page.items)
        setNextCursor(page.nextCursor)
        currentCursor.current = cursor
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar la página')
      } finally {
        setLoading(false)
      }
    },
    [fetchPage],
  )

  useEffect(() => {
    cursorHistory.current = []
    load(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPage])

  const next = useCallback(async () => {
    if (!nextCursor) return
    cursorHistory.current.push(currentCursor.current)
    await load(nextCursor)
  }, [nextCursor, load])

  const prev = useCallback(async () => {
    const previousCursor = cursorHistory.current.pop()
    if (previousCursor === undefined) return
    await load(previousCursor)
  }, [load])

  const reload = useCallback(() => load(currentCursor.current), [load])

  return {
    items,
    loading,
    error,
    hasNext: Boolean(nextCursor),
    hasPrev: cursorHistory.current.length > 0,
    next,
    prev,
    reload,
  }
}
