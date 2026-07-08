import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function LoginForm() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Email y contraseña son obligatorios.')
      return
    }

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch {
      setError('No se pudo iniciar sesión. Verifica tus datos.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="tu@email.com"
      />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Tu contraseña"
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}