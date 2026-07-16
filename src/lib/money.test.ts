import { describe, expect, it } from 'vitest'
import { formatMoney, parseToCents } from './money'

describe('formatMoney', () => {
  it('convierte centavos enteros a un string de moneda con 2 decimales', () => {
    // formatMoney uses es-CO locale internally, which formats with space + comma decimal separator, not '$10.50'
    expect(formatMoney(1050, 'USD')).toBe('US$ 10,50')
  })
})

describe('parseToCents', () => {
  it('convierte un string decimal a centavos enteros', () => {
    expect(parseToCents('10.5')).toBe(1050)
  })

  it('retorna null para montos menores o iguales a cero', () => {
    expect(parseToCents('0')).toBeNull()
    expect(parseToCents('-5')).toBeNull()
  })

  it('retorna null para valores no numéricos', () => {
    expect(parseToCents('abc')).toBeNull()
  })
})

