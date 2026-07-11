export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
}

export interface SendChatMessageRequest {
  message: string
}

export interface SendChatMessageResponse {
  message: ChatMessage
}