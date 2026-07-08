import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function RegisterForm() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('ARG')
  const [timezone, setTimezone] = useState('America/Argentina/Buenos_Aires')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !country.trim() || !timezone.trim()) {
      setError('Todos los campos son obligatorios.')
      return
    }

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        country_of_residence: country,
        timezone,
      })

      navigate('/login')
    } catch {
      setError('No se pudo crear la cuenta. Intenta nuevamente.')
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h1>Crear cuenta</h1>

      <label htmlFor="firstName">Nombre</label>
      <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Alan" />

      <label htmlFor="lastName">Apellido</label>
      <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Cardiello" />

      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />

      <label htmlFor="password">Contraseña</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" />

      <label htmlFor="country">País</label>
      <input id="country" value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} />

      <label htmlFor="timezone">Zona horaria</label>
      <input id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />

      {error && <p role="alert">{error}</p>}

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="auth-link-box">
        ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión →</Link>
      </p>
    </form>
  )
}