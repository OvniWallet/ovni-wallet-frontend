import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRefreshInterceptor } from './sessionRefresh'

function makeAxiosError(status: number, url: string) {
  return {
    isAxiosError: true,
    response: { status },
    config: { url, headers: {} },
  } as any
}

describe('createRefreshInterceptor', () => {
  let client: { request: ReturnType<typeof vi.fn> }
  let deps: {
    getRefreshToken: ReturnType<typeof vi.fn>
    refresh: ReturnType<typeof vi.fn>
    storeTokens: ReturnType<typeof vi.fn>
    onRefreshFailed: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    client = { request: vi.fn().mockResolvedValue({ data: 'retried-ok' }) }
    deps = {
      getRefreshToken: vi.fn().mockReturnValue('refresh-token-abc'),
      refresh: vi.fn().mockResolvedValue({
        access_token: 'new-access',
        refresh_token: 'new-refresh',
      }),
      storeTokens: vi.fn(),
      onRefreshFailed: vi.fn(),
    }
  })

  it('re-lanza errores que no son 401 sin tocar nada', async () => {
    const handler = createRefreshInterceptor(client as any, deps)
    const error = makeAxiosError(500, '/wallets/balance')

    await expect(handler(error)).rejects.toBe(error)
    expect(deps.refresh).not.toHaveBeenCalled()
  })

  it('no reintenta si el 401 viene del propio /auth/refresh (evita loop infinito)', async () => {
    const handler = createRefreshInterceptor(client as any, deps)
    const error = makeAxiosError(401, '/auth/refresh')

    await expect(handler(error)).rejects.toBe(error)
    expect(deps.refresh).not.toHaveBeenCalled()
  })

  it('en un 401 normal: pide refresh, guarda los tokens nuevos y reintenta la request original', async () => {
    const handler = createRefreshInterceptor(client as any, deps)
    const error = makeAxiosError(401, '/wallets/balance')

    const result = await handler(error)

    expect(deps.refresh).toHaveBeenCalledWith('refresh-token-abc')
    expect(deps.storeTokens).toHaveBeenCalledWith({
      access_token: 'new-access',
      refresh_token: 'new-refresh',
    })
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/wallets/balance',
        headers: expect.objectContaining({ Authorization: 'Bearer new-access' }),
      }),
    )
    expect(result).toEqual({ data: 'retried-ok' })
  })

  it('si el refresh falla, limpia la sesión y re-lanza el error original', async () => {
    deps.refresh.mockRejectedValue(new Error('refresh token expirado'))
    const handler = createRefreshInterceptor(client as any, deps)
    const error = makeAxiosError(401, '/wallets/balance')

    await expect(handler(error)).rejects.toBe(error)
    expect(deps.onRefreshFailed).toHaveBeenCalled()
    expect(client.request).not.toHaveBeenCalled()
  })

  it('si no hay refresh token guardado, limpia la sesión sin llamar al backend', async () => {
    deps.getRefreshToken.mockReturnValue(null)
    const handler = createRefreshInterceptor(client as any, deps)
    const error = makeAxiosError(401, '/wallets/balance')

    await expect(handler(error)).rejects.toBe(error)
    expect(deps.refresh).not.toHaveBeenCalled()
    expect(deps.onRefreshFailed).toHaveBeenCalled()
  })

  it('si dos requests fallan con 401 en paralelo, solo dispara un refresh (comparten la misma promesa)', async () => {
    const handler = createRefreshInterceptor(client as any, deps)
    const errorA = makeAxiosError(401, '/wallets/balance')
    const errorB = makeAxiosError(401, '/transactions')

    await Promise.all([handler(errorA), handler(errorB)])

    expect(deps.refresh).toHaveBeenCalledTimes(1)
    expect(client.request).toHaveBeenCalledTimes(2)
  })
})
