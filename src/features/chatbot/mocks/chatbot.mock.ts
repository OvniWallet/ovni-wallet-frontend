import type { ChatMessage } from '../types'

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'assistant-welcome',
    role: 'assistant',
    content:
      'Hola, soy el asistente de Ovni Wallet. Puedo ayudarte con balances, transferencias, tarjetas y conversiones.',
    createdAt: new Date().toISOString(),
  },
]

export const suggestedQuestions = [
  '¿Cómo envío dinero?',
  '¿Cómo convierto monedas?',
  '¿Cómo bloqueo mi tarjeta?',
  '¿Dónde veo mis movimientos?',
]