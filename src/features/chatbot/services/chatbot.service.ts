import type {
  ChatMessage,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from '../types'

const getMockResponse = (message: string): string => {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes('transfer')) {
    return 'Podés enviar dinero desde la sección Transferir. Necesitás el correo del destinatario, el monto y la moneda.'
  }

  if (
    normalizedMessage.includes('exchange') ||
    normalizedMessage.includes('convert')
  ) {
    return 'Desde Exchange podés elegir la moneda de origen, la moneda de destino y revisar la cotización antes de confirmar.'
  }

  if (
    normalizedMessage.includes('tarjeta') ||
    normalizedMessage.includes('bloquear')
  ) {
    return 'En Tarjetas podés consultar el estado de tu tarjeta virtual y bloquearla o desbloquearla.'
  }

  if (
    normalizedMessage.includes('movimiento') ||
    normalizedMessage.includes('historial')
  ) {
    return 'Tus últimas operaciones aparecen en Inicio. El historial completo está disponible en Movimientos.'
  }

  return 'Todavía estoy funcionando con respuestas de demostración. Pronto podré consultar información real de tu cuenta.'
}

export const chatbotService = {
  async sendMessage(
    request: SendChatMessageRequest,
  ): Promise<SendChatMessageResponse> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const message: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: getMockResponse(request.message),
      createdAt: new Date().toISOString(),
    }

    return { message }
  },
}