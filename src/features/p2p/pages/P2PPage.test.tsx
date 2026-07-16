import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { P2PPage } from './P2PPage'
import { p2pApi } from '@/api/p2p.api'

vi.mock('@/api/p2p.api', () => ({
  p2pApi: { transfer: vi.fn() },
}))

async function fillForm() {
  // Nota: se tipea secuencialmente (no con Promise.all) porque userEvent@14
  // no soporta llamadas a `.type()` concurrentes sobre distintos inputs:
  // las pulsaciones se pisan entre sí y los campos quedan vacíos.
  await userEvent.type(screen.getByLabelText('Email del destinatario'), 'amigo@correo.com')
  await userEvent.type(screen.getByLabelText('Monto'), '25')
}

describe('P2PPage', () => {
  beforeEach(() => {
    vi.mocked(p2pApi.transfer).mockReset()
  })

  it('muestra una confirmación antes de disparar la transferencia', async () => {
    render(
      <MemoryRouter>
        <P2PPage />
      </MemoryRouter>,
    )

    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /revisar envío/i }))

    expect(screen.getByText(/confirmá los datos/i)).toBeInTheDocument()
    expect(screen.getByText(/amigo@correo\.com/)).toBeInTheDocument()
    expect(p2pApi.transfer).not.toHaveBeenCalled()
  })

  it('solo llama a p2pApi.transfer después de confirmar', async () => {
    vi.mocked(p2pApi.transfer).mockResolvedValue({
      transaction_id: 'tx-1',
      amount_transferred: 2500,
      currency: 'USD',
    })

    render(
      <MemoryRouter>
        <P2PPage />
      </MemoryRouter>,
    )

    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /revisar envío/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirmar y enviar/i }))

    expect(p2pApi.transfer).toHaveBeenCalledWith(
      expect.objectContaining({ recipient_email: 'amigo@correo.com', amount_in_cents: 2500 }),
    )
  })

  it('permite volver a editar sin enviar la transferencia', async () => {
    render(
      <MemoryRouter>
        <P2PPage />
      </MemoryRouter>,
    )

    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /revisar envío/i }))
    await userEvent.click(screen.getByRole('button', { name: /editar datos/i }))

    expect(screen.getByLabelText('Email del destinatario')).toBeInTheDocument()
    expect(p2pApi.transfer).not.toHaveBeenCalled()
  })
})
