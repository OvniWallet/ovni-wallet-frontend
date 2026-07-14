import { isAxiosError } from 'axios'

export interface ApiErrorInfo {
  code: string
  message: string
}

export function getApiError(err: unknown): ApiErrorInfo {
  if (isAxiosError(err)) {
    const data = err.response?.data as
      | { code?: string; message?: string; error?: { code?: string; message?: string } }
      | undefined

    const code = data?.code ?? data?.error?.code ?? 'UNKNOWN_ERROR'
    const message = data?.message ?? data?.error?.message ?? err.message

    return { code, message }
  }
  return { code: 'UNKNOWN_ERROR', message: 'Ocurrió un error inesperado' }
}