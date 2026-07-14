import { useState, type FormEvent } from 'react'
import { chatbotApi } from '@/api/chatbot.api'
import { getApiError } from '@/api/errors'

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
    <section style={{ padding: '2rem', maxWidth: '480px' }}>
      <h2>Asistente Virtual</h2>
      <p>Bienvenido. ¿En qué puedo ayudarte hoy?</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0', minHeight: '120px' }}>
        {messages.map((entry, i) => (
          <p
            key={i}
            style={{
              alignSelf: entry.role === 'user' ? 'flex-end' : 'flex-start',
              color: entry.role === 'system' ? '#DC2626' : 'inherit',
            }}
          >
            {entry.text}
          </p>
        ))}
        {loading && <p style={{ color: '#6B7280' }}>Pensando...</p>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Escribe tu consulta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading}>
          Enviar
        </button>
      </form>
    </section>
  )
}