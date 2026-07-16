import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './AuthProvider'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { authService } from '@/features/auth/services/auth.service'

vi.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}))

function Consumer() {
  const { user, login } = useAuth()

  return (
    <div>
      <span data-testid="user-email">{user?.email ?? 'sin-usuario'}</span>
      <button
        onClick={() =>
          login({ email: 'alan@ovni.com', password: 'secret123!' })
        }
      >
        login
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(authService.login).mockResolvedValue({
      access_token: 'access-123',
      refresh_token: 'refresh-123',
      user: { id: 'user-1', email: 'alan@ovni.com', first_name: 'Alan', last_name: 'C' },
    } as any)
  })

  it('popula el user del contexto después de un login exitoso', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('user-email').textContent).toBe('sin-usuario')

    await act(async () => {
      screen.getByRole('button', { name: 'login' }).click()
    })

    expect(screen.getByTestId('user-email').textContent).toBe('alan@ovni.com')
  })

  it('rehidrata el user desde localStorage al remontar (simulando F5)', async () => {
    const { unmount } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByRole('button', { name: 'login' }).click()
    })

    unmount()

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('user-email').textContent).toBe('alan@ovni.com')
  })
})
