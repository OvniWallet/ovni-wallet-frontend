import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Bot, Send } from 'lucide-react'
import { chatbotApi } from '@/api/chatbot.api'
import { getApiError } from '@/api/errors'

interface ChatEntry {
  role: 'user' | 'assistant' | 'system'
  text: string
}

const quickQuestions = [
  '¿Cómo envío dinero?',
  '¿Cómo convierto monedas?',
  '¿Dónde veo mis movimientos?',
  '¿Cómo funcionan las tarjetas virtuales?',
]

export function ChatbotPage() {
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      role: 'assistant',
      text: 'Hola, soy el asistente de Ovni Wallet. Puedo ayudarte con transferencias, cambios de moneda, tarjetas y movimientos.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [loading, messages])

  const sendMessage = async (message: string) => {
    const cleanMessage = message.trim()
    if (!cleanMessage || loading) return

    setMessages((current) => [...current, { role: 'user', text: cleanMessage }])
    setInput('')
    setLoading(true)

    try {
      const result = await chatbotApi.sendMessage(cleanMessage)
      setMessages((current) => [...current, { role: 'assistant', text: result.reply }])
    } catch (err) {
      const { code } = getApiError(err)
      const friendlyMessage =
        code === 'UNKNOWN_ERROR'
          ? 'El asistente todavía no está disponible. Intentá nuevamente cuando el backend esté conectado.'
          : 'El asistente está temporalmente degradado. Intentá más tarde.'

      setMessages((current) => [...current, { role: 'system', text: friendlyMessage }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await sendMessage(input)
  }

  return (
    <section className="chatbot-page">
      <aside className="chatbot-help">
        <span className="chatbot-help-icon" aria-hidden="true"><Bot size={24} /></span>

        <div>
          <p className="section-eyebrow">Asistente Ovni</p>
          <h1>¿Cómo puedo ayudarte?</h1>
          <span>Consultá información general sobre las funciones de Ovni Wallet.</span>
        </div>

        <div className="chatbot-suggestions">
          {quickQuestions.map((question) => (
            <button
              key={question}
              type="button"
              disabled={loading}
              onClick={() => sendMessage(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </aside>

      <section className="chat-window">
        <header className="chat-window-header">
          <span aria-hidden="true"><Bot size={22} /></span>
          <div>
            <strong>Asistente Ovni</strong>
            <small>Disponible</small>
          </div>
        </header>

        <div className="chat-messages" ref={scrollRef}>
          {messages.map((entry, index) => (
            <article
              key={`${entry.role}-${index}`}
              className={`chat-message chat-message-${entry.role}`}
            >
              {entry.role !== 'user' && (
                <span aria-hidden="true"><Bot size={17} /></span>
              )}
              <p>{entry.text}</p>
            </article>
          ))}

          {loading && (
            <article className="chat-message chat-message-assistant">
              <span aria-hidden="true"><Bot size={17} /></span>
              <p>Pensando...</p>
            </article>
          )}
        </div>

        <form className="chat-composer" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Escribí tu consulta..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />

          <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar consulta">
            <Send size={20} />
          </button>
        </form>
      </section>
    </section>
  )
}
