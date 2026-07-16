import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginForm } from './LoginForm'
import { useAuth } from '../hooks/useAuth'

vi.mock('../hooks/useAuth')

function renderForm() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  )
}

describe('LoginForm', () => {
  const login = vi.fn()

  beforeEach(() => {
    login.mockReset()
    vi.mocked(useAuth).mockReturnValue({
      login,
      loading: false,
    } as any)
  })

  it('muestra un mensaje específico cuando el backend responde 401', async () => {
    login.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' } },
    })

    renderForm()
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'alan@ovni.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secret123!')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/correo o contraseña incorrectos/i)
  })

  it('muestra un mensaje específico cuando el backend responde 403', async () => {
    login.mockRejectedValue({
      isAxiosError: true,
      response: { status: 403, data: { code: 'FORBIDDEN', message: 'Acceso denegado' } },
    })

    renderForm()
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'alan@ovni.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secret123!')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no tenés permisos/i)
  })

  it('muestra un mensaje genérico ante un error de red', async () => {
    login.mockRejectedValue({ isAxiosError: true, response: undefined })

    renderForm()
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'alan@ovni.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secret123!')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no se pudo iniciar sesión/i)
  })
})
