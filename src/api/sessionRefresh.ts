import type { AxiosError, AxiosInstance } from 'axios'

export interface StoredTokens {
  access_token: string
  refresh_token: string
}

export interface RefreshDeps {
  getRefreshToken: () => string | null
  refresh: (refreshToken: string) => Promise<StoredTokens>
  storeTokens: (tokens: StoredTokens) => void
  onRefreshFailed: () => void
}

export function createRefreshInterceptor(client: AxiosInstance, deps: RefreshDeps) {
  let refreshPromise: Promise<StoredTokens> | null = null

  const startRefresh = (): Promise<StoredTokens> => {
    if (!refreshPromise) {
      const token = deps.getRefreshToken()

      refreshPromise = (token ? deps.refresh(token) : Promise.reject(new Error('NO_REFRESH_TOKEN')))
        .finally(() => {
          refreshPromise = null
        })
    }

    return refreshPromise
  }

  return async (error: AxiosError) => {
    const status = error.response?.status
    const requestUrl = error.config?.url ?? ''

    if (status !== 401 || requestUrl.includes('/auth/refresh') || requestUrl.includes('/auth/login')) {
      return Promise.reject(error)
    }

    try {
      const tokens = await startRefresh()
      deps.storeTokens(tokens)

      return client.request({
        ...error.config,
        headers: {
          ...error.config?.headers,
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })
    } catch {
      deps.onRefreshFailed()
      return Promise.reject(error)
    }
  }
}
