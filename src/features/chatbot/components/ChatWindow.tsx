import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { Bot, Send } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { chatbotService } from '../services/chatbot.service'
import { initialChatMessages } from '../mocks/chatbot.mock'
import type { ChatMessage } from '../types'

export function ChatWindow() {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialChatMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const historyRef = useRef<HTMLElement | null>(null)
  const shouldAutoScrollRef = useRef(true)

  const updateScrollPosition = () => {
    const history = historyRef.current

    if (!history) return

    const distanceFromBottom =
      history.scrollHeight - history.scrollTop - history.clientHeight

    shouldAutoScrollRef.current = distanceFromBottom < 100
  }

  useEffect(() => {
    const history = historyRef.current

    if (!history || !shouldAutoScrollRef.current) return

    history.scrollTo({
      top: history.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, loading])

  const sendMessage = async (content: string) => {
    const trimmedContent = content.trim()

    if (!trimmedContent || loading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    }

    shouldAutoScrollRef.current = true
    setMessages((current) => [...current, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await chatbotService.sendMessage({
        message: trimmedContent,
      })

      setMessages((current) => [...current, response.message])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await sendMessage(input)
  }

  return (
    <section className="chat-card">
      <header className="chat-header">
        <span className="chat-header-icon" aria-hidden="true">
          <Bot size={22} />
        </span>

        <span>
          <strong>Asistente Ovni</strong>
          <small>{loading ? 'Escribiendo...' : 'Disponible'}</small>
        </span>
      </header>

      <section
        ref={historyRef}
        className="chat-history"
        aria-live="polite"
        onScroll={updateScrollPosition}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {loading && (
          <p className="chat-typing">
            El asistente está preparando una respuesta...
          </p>
        )}
      </section>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escribí tu consulta..."
          aria-label="Consulta para el asistente"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Enviar consulta"
        >
          <Send size={19} />
        </button>
      </form>
    </section>
  )
}