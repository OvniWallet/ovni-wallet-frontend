import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
      setError('No se pudo iniciar sesión. Verificá tus datos.')
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="auth-heading">
        <p>Bienvenido nuevamente</p>
        <h1>Iniciar sesión</h1>
        <span>Ingresá tus datos para acceder a tu cuenta.</span>
      </div>

      <label htmlFor="email">Correo electrónico</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="nombre@correo.com"
        autoComplete="email"
      />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Ingresá tu contraseña"
        autoComplete="current-password"
      />

      {error && <p role="alert">{error}</p>}

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </button>

      <p className="auth-link-box">
        ¿Todavía no tenés una cuenta?
        <Link to="/register"> Crear cuenta</Link>
      </p>
    </form>
  )
}