import { httpClient } from './httpClient'

export interface ChatbotMessageResponse {
  reply: string
}

export const chatbotApi = {
  sendMessage: async (message: string): Promise<ChatbotMessageResponse> => {
    const response = await httpClient.post('/chatbot/query', { message })
    return response.data.data
  },
}