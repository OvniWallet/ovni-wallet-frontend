import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DepositForm } from './DepositForm'
import { transactionsApi } from '@/api/transactions.api'

vi.mock('@/api/transactions.api', () => ({
  transactionsApi: { deposit: vi.fn() },
}))

describe('DepositForm', () => {
  const onSuccess = vi.fn()

  beforeEach(() => {
    onSuccess.mockReset()
    vi.mocked(transactionsApi.deposit).mockReset()
  })

  it('no envía la request si el monto es inválido', async () => {
    render(<DepositForm onSuccess={onSuccess} />)

    await userEvent.type(screen.getByLabelText('Monto'), '0')
    await userEvent.click(screen.getByRole('button', { name: /depositar/i }))

    expect(transactionsApi.deposit).not.toHaveBeenCalled()
    expect(await screen.findByRole('alert')).toHaveTextContent(/monto válido/i)
  })

  it('envía el depósito en centavos y llama a onSuccess', async () => {
    vi.mocked(transactionsApi.deposit).mockResolvedValue({
      transaction_id: 'tx-1',
      type: 'DEPOSIT',
      status: 'COMPLETED',
    })

    render(<DepositForm onSuccess={onSuccess} />)

    await userEvent.type(screen.getByLabelText('Monto'), '25.50')
    await userEvent.selectOptions(screen.getByLabelText('Divisa'), 'ARS')
    await userEvent.click(screen.getByRole('button', { name: /depositar/i }))

    expect(transactionsApi.deposit).toHaveBeenCalledWith(
      expect.objectContaining({ amount_in_cents: 2550, currency: 'ARS' }),
    )
    expect(await screen.findByText(/depósito realizado/i)).toBeInTheDocument()
    expect(onSuccess).toHaveBeenCalled()
  })
})
