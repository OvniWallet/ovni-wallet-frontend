import { MessageCircleQuestion } from 'lucide-react'
import { ChatWindow } from '../components/ChatWindow'
import { suggestedQuestions } from '../mocks/chatbot.mock'

export function ChatbotPage() {
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

      <ChatWindow />
    </section>
  )
}