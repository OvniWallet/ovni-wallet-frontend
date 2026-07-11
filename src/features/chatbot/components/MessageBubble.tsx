import { Bot, User } from 'lucide-react'
import type { ChatMessage } from '../types'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === 'assistant'

  return (
    <article
      className={
        isAssistant
          ? 'chat-message chat-message-assistant'
          : 'chat-message chat-message-user'
      }
    >
      <span className="chat-avatar" aria-hidden="true">
        {isAssistant ? <Bot size={18} /> : <User size={18} />}
      </span>

      <p>{message.content}</p>
    </article>
  )
}