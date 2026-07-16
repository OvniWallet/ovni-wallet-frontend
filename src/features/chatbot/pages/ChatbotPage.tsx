import { useState, type FormEvent } from 'react'
import { Bot, MessageCircleQuestion, Send, User } from 'lucide-react'
import { chatbotApi } from '@/api/chatbot.api'
import { getApiError } from '@/api/errors'
import { suggestedQuestions } from '../mocks/chatbot.mock'

interface ChatEntry {
  role: 'user' | 'assistant' | 'system'
  text: string
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<ChatEntry[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const result = await chatbotApi.sendMessage(userMessage)
      setMessages((prev) => [...prev, { role: 'assistant', text: result.reply }])
    } catch (err) {
      const { code } = getApiError(err)

      const friendlyMessage =
        code === 'UNKNOWN_ERROR'
          ? 'El asistente todavía no está disponible (backend pendiente).'
          : 'El asistente está temporalmente degradado. Intenta más tarde.'

      setMessages((prev) => [...prev, { role: 'system', text: friendlyMessage }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="chat-page">
      <aside className="chat-guide">
        <span className="chat-guide-icon" aria-hidden="true">
          <MessageCircleQuestion size={26} />
        </span>

        <h1>¿Cómo puedo ayudarte?</h1>

        <p>
          Consultá información general sobre las funciones de Ovni Wallet.
        </p>

        <ul>
          {suggestedQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </aside>

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

        <section className="chat-history" aria-live="polite">
          {messages.map((entry, i) => {
            const isUser = entry.role === 'user'

            return (
              <article
                key={i}
                className={
                  isUser
                    ? 'chat-message chat-message-user'
                    : 'chat-message chat-message-assistant'
                }
              >
                <span className="chat-avatar" aria-hidden="true">
                  {isUser ? <User size={18} /> : <Bot size={18} />}
                </span>

                <p style={entry.role === 'system' ? { color: '#DC2626' } : undefined}>
                  {entry.text}
                </p>
              </article>
            )
          })}

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
            onChange={(e) => setInput(e.target.value)}
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
    </section>
  )
}
